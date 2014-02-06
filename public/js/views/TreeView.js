define([
  'jquery',
  'underscore',
  'backbone',
  'utility',
  'text!templates/tree_view.html', 
  'bootstrap'
], function($, _, Backbone, Util, TreeViewTemplate, Bootstrap){

  var TreeView = Backbone.View.extend({
    el: $("#tree"),
    session: null,

    rendered: false,
    
    initialize: function(session){
      this.session = session;
    },

    render: function(){
      var template = _.template(TreeViewTemplate, {data: null});
      this.$el.html(template);
    },

    hide: function(){
      this.$el.hide();
    },

    show: function(){
      console.log(this.session.tree);
      this.$el.show();

      Util.logAction(this.session.email, "Viewed Tree Page", "null");

      if(!this.rendered) {
        this.render();
        this.rendered = true;
      }

      var that = this;
      var treeData = this.session.tree; 

      //Detect new nodes
      if (this.session.newNode != null) {

        if (!(this.session.activeNode.children instanceof Array)) {
          this.session.activeNode.children = [];
        }
        this.session.activeNode.children.push(this.session.newNode);
        
        this.updateSessionTree(this.session.tree, this.session.email);
  
        this.session.newNode = null;
      }

      window.idBefore = null;
      window.idAfter = null;

      renderTree(this.session.tree);
      this.session.activeNode = this.session.tree
      Util.renderGraph(this.session.activeNode, "#plot-preview", this.session);

      var graphid = this.session.activeNode.graphid;

      $(".node").click( function(){
          Util.activateNodeById(that.session, treeData, $(this).attr("id"));
          Util.renderGraph(that.session.activeNode, "#plot-preview", that.session);
      });

      $(window).resize(function() {
          Util.renderGraph(that.session.activeNode, "#plot-preview", that.session);
       
      });

      $("#delete-graph").click( function(){
          if(that.session.activeNode.graphid == that.session.tree.graphid) {
            that.session.tree = {};
            that.$el.find("#plot-preview").html("");

            that.updateSessionTree(that.session.tree, that.session.email);
            renderTree(that.session.tree);
            return;
          }

          Util.deleteNode(treeData, that.session.activeNode.graphid);

          that.updateSessionTree(that.session.tree, that.session.email);
          renderTree(that.session.tree);
          return;
      });

      $("#edit-graph").click(function() {
        this.blur();
        $("#setupModal").modal({
          remote: false
        });

        $("#title").val(that.session.getGraphData(that.session.activeNode.graphid).title);
        $("#xLabel").val(that.session.getGraphData(that.session.activeNode.graphid).label.x);
        $("#yLabel").val(that.session.getGraphData(that.session.activeNode.graphid).label.y);
        $("#xUnit").val(that.session.getGraphData(that.session.activeNode.graphid).unit.x);
        $("#yUnit").val(that.session.getGraphData(that.session.activeNode.graphid).unit.y);

        $("#setupModalSubmit").click(function(){
          that.session.getGraphData(that.session.activeNode.graphid).title = $("#title").val();
          that.session.getGraphData(that.session.activeNode.graphid).label.x = $("#xLabel").val();
          that.session.getGraphData(that.session.activeNode.graphid).label.y = $("#yLabel").val();
          that.session.getGraphData(that.session.activeNode.graphid).unit.x = $("#xUnit").val();
          that.session.getGraphData(that.session.activeNode.graphid).unit.y = $("#yUnit").val();

          Util.ajaxPOST("../data/change",
                        {
                          key: that.session.activeNode.graphid,
                          data: that.session.getGraphData(that.session.activeNode.graphid)
                        },
                        function(){},
                        function(){ console.log("data change went awry..."); },
                        function(){});

          Util.renderGraph(that.session.activeNode, "#plot-preview", that.session);
          $(this).unbind();
        });
      });

      $("#export-graph").click(function(){

        $("#export-graph").attr("disabled", "disabled");
        var tempDat = jQuery.extend({}, that.session.getGraphData(that.session.activeNode.graphid));
        
        // hacking it by just inserting ids here. need refactoring.
        tempDat.userid = that.session.email;
        tempDat.graphid = that.session.activeNode.graphid;

        tempDat = JSON.stringify(tempDat);

        Util.ajaxPOST("http://compute.getbombe.com/compute",
                        {
                          operation: "export_export",
                          data: tempDat
                        },
                        function(res){
          
                          Util.logAction(that.session.email, "Exported Graph", JSON.decycle(that.session.activeNode));
                          ga('send', 'event', 'button', 'click', 'export');
                      
                          var filename_pdf = res.result.filename_pdf;
                          var filename_svg = res.result.filename_svg;
                          var filename_eps = res.result.filename_eps;
                          
                          $("#exportModal-body").html('Download your graph in the following formats:'
                          + ' <a target="_blank" href="http://compute.getbombe.com/static/uploads/' + filename_pdf + '">PDF</a>'
                          + ' <a target="_blank" href="http://compute.getbombe.com/static/uploads/' + filename_svg + '">SVG</a>'
                          + ' <a target="_blank" href="http://compute.getbombe.com/static/uploads/' + filename_eps + '">EPS</a>');
                          $("#exportModal").modal();
                          $("#export-graph").removeAttr("disabled");
                        },
                        function(){ console.log("Compute failed."); },
                        function(){}
                      );
      });


      $("#create-graph").click ( function(){
        var graphid = parseFloat($("#plot-preview-titlebar .graphid").html());
        window.idBefore = graphid;
        window.idAfter = "new";

        Util.activateNodeById(that.session, treeData, window.idAfter);
        Util.renderGraph(that.session.activeNode, "#plot-after", that.session);

        Util.activateNodeById(that.session, treeData, window.idBefore);
        Util.renderGraph(that.session.activeNode, "#plot-before", that.session);

        Util.logAction(that.session.email, "Created New Graph", "null");

        window.location.href = "/#/operation";
      });
      

      function renderTree(treeData) {

          that.$el.find("#treeview").html("");

          var tree = d3.layout.tree()
              .sort(null)
              .size([1000, 1000 - 20*10])
              .separation(function(a, b) { return (a.parent == b.parent ? 0.5 : 1); })
              .children(function(d)
              {
                  return (!d.children || d.children.length === 0) ? null : d.children;
              });

          var nodes = tree.nodes(treeData);
          var links = tree.links(nodes);

           var layoutRoot = d3.select('#treeview')
               .append("svg:svg").attr("width", 1000).attr("height", 1000)
               .append("svg:g")
               .attr("class", "container")
               .attr("transform", "translate(" + 80 + ",0)");

           // Edges between nodes as a <path class="link" />
           var link = d3.svg.diagonal()
               .projection(function(d)
               {
                   return [d.y, d.x];
               });

           layoutRoot.selectAll("path.link")
               .data(links)
               .enter()
               .append("svg:path")
               .attr("class", "link")
               .attr("d", link);

           var nodeGroup = layoutRoot.selectAll("g.node")
               .data(nodes)
               .enter()
               .append("svg:g")
               .attr("class", "node")
                 .attr("id", function(d){return d.graphid})
               .attr("transform", function(d)
               {
                   return "translate(" + d.y + "," + d.x + ")";
               });

           /*nodeGroup.append("rect")
               .attr("class", "nodebox")
               .attr("x", -150/2)
               .attr("y", -100/2)
               .attr("width", 150)
               .attr("height", 100);*/
            nodeGroup.append("circle")
              .attr("class", "nodebox")
              .attr("x", -150/2)
              .attr("y", -100/2)
              .attr("r", 60);

          Util.miniGraph(treeData, that.session);
        }
    },

        updateSessionTree: function(tree, email){
          Util.ajaxPOST("../newtree",
              {
                tree: JSON.stringify(JSON.decycle(tree)),
                email: email
              },
              function(){
              },
              function(){ console.log("error: failed to save updated tree"); },
              function(){});
        }
  });

  return TreeView;
  
});
