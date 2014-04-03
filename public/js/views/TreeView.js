define([
  'jquery',
  'underscore',
  'backbone',
  'utility',
  'text!templates/tree_view.html', 
  'bootstrap',
  'panzoom',
  'd3bootstrap'
], function($, _, Backbone, Util, TreeViewTemplate, Bootstrap, Panzoom, D3bootstrap){

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

      
      var $section = $('#treeviewContainer');
      var $panzoom = $section.find('#treeview').panzoom();
      $panzoom.parent().on('mousewheel.focal', function( e ) {
        e.preventDefault();
        var delta = e.delta || e.originalEvent.wheelDelta;
        var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
        $panzoom.panzoom('zoom', zoomOut, {
          increment: 0.02,
          focal: e
        });
      });
      
    },

    hide: function(){
      this.$el.hide();
    },

    show: function(){
      if ($.isEmptyObject(this.session.tree)){
        window.location.href = "#/import";
        return;
      }

      console.log(this.session);
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
        
        this.updateSessionTree(this.session.tree, this.session.currentTree);
  
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

      $(".nodebox").tooltip({
        'container': 'body',
        'placement': 'top'
      });
  

      $(window).resize(function() {
          Util.renderGraph(that.session.activeNode, "#plot-preview", that.session);
       
      });

      $("#delete-graph").click( function(){
          if(that.session.activeNode.graphid == that.session.tree.graphid) {
            // can't delete root
            //alert("You cannot delete the root node!");
            return;
          }

          Util.deleteNode(treeData, that.session.activeNode.graphid);

          that.updateSessionTree(that.session.tree, that.session.currentTree);
          //renderTree(that.session.tree);
          that.show();
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

          renderTree(that.session.tree);
          $(".nodebox").tooltip({
            'container': 'treeView',
            'placement': 'top'
          });

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
                          
                           $("#exportModal-body").html('<div id="export-buttons" class="btn-group">'
                           + ' <a target="_blank" class="btn btn-default btn-lg" href="http://compute.getbombe.com/static/uploads/' + filename_pdf + '">Download PDF</a>'
                           + ' <a target="_blank" class="btn btn-default btn-lg" href="http://compute.getbombe.com/static/uploads/' + filename_svg + '">Download SVG</a>'
                           + ' <a target="_blank" class="btn btn-default btn-lg" href="http://compute.getbombe.com/static/uploads/' + filename_eps + '">Download EPS</a>'
                           + '</div>');

                           $("#exportModal-body").append('<div class="form-group text-left"><label>Share this figure:</label> <input onClick="this.select();" class="form-control" type="text" value="http://compute.getbombe.com/static/uploads/' + filename_pdf + '" readonly></div>');

                          $("#exportModal").modal();
                          $("#export-graph").removeAttr("disabled");
                        },
                        function(){ console.log("Compute failed."); },
                        function(){}
                      );
      });


      $("#create-graph").click(function(){
        createGraph();
      });
      $(".nodebox").dblclick(function(){
        createGraph();
      });

      function createGraph(){
        var graphid = parseFloat($("#plot-preview-titlebar .graphid").html());
        window.idBefore = graphid;
        window.idAfter = "new";

        Util.activateNodeById(that.session, treeData, window.idAfter);
        Util.renderGraph(that.session.activeNode, "#plot-after", that.session);

        Util.activateNodeById(that.session, treeData, window.idBefore);
        Util.renderGraph(that.session.activeNode, "#plot-before", that.session);

        Util.logAction(that.session.email, "Created New Graph", "null");

        window.location.href = "/#/operation";
      }
      

      function renderTree(treeData) {

          that.$el.find("#treeview").html("");

          var tree = d3.layout.tree()
              .sort(null)
              .size([800, 800 - 20*10])
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

            nodeGroup.append("circle")
              .attr("class", "nodebox")
              .attr("title", function(d){ return that.session.getGraphData(d.graphid).title})
              .attr("x", -150/2)
              .attr("y", -100/2)
              .attr("r", 60);

          Util.miniGraph(treeData, that.session);
        }
    },

        updateSessionTree: function(tree, key){
          Util.ajaxPOST("../newtree",
              {
                tree: JSON.stringify(JSON.decycle(tree)),
                key: key
              },
              function(){
              },
              function(){ console.log("error: failed to save updated tree"); },
              function(){});
        }
  });

  return TreeView;
  
});
