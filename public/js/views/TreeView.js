define([
  'jquery',
  'underscore',
  'backbone',
  'utility',
  'text!templates/tree_view.html'
], function($, _, Backbone, Util, TreeViewTemplate){

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
      this.$el.show();

      Util.logAction(this.session.email, "Viewed Tree Page", "null");

      if(!this.rendered) {
        this.render();
        this.rendered = true;
      }
      //d3.select("svg").remove();

      var that = this;
      var treeData = this.session.tree; 

      //Detect new nodes
      if (this.session.newNode != null) {
        //console.log(this.session.activeNode);
        if (!(this.session.activeNode['data']['children'] instanceof Array)) {
          this.session.activeNode['data']['children'] = [];
        }
        this.session.activeNode['data']['children'].push(this.session.newNode);
        //console.log(this.session.activeNode);
        console.log(this.session.newNode);

        Util.ajaxPOST("../newtree",
              {
                tree: JSON.stringify(JSON.decycle(this.session.tree)),
                email: this.session.email
              },
              function(){
              },
              function(){ console.log("error: failed to save updated tree"); },
              function(){});
  
         this.session.newNode = null;
      }

       //renderTree(this.session.tree);
     

      window.idBefore = null;
      window.idAfter = null;

      renderTree(this.session.tree);
      Util.activateNodeById(this.session, treeData, 1);
      Util.renderGraph(this.session.activeNode, "#plot-preview");

      var graphid = this.session.activeNode['data']['graphid'];

      $(".node").click( function(){
          Util.activateNodeById(that.session, treeData, $(this).attr("id"));
          Util.renderGraph(that.session.activeNode, "#plot-preview");
      });

      // $(".nodebox").click( function(){
      //   $(".nodebox").css("class", "active");
      // });

      $(window).resize(function() {
          Util.renderGraph(that.session.activeNode, "#plot-preview");
       
      });

      $("#delete-graph").click( function(){
          console.log("deleted:" + graphid);
          Util.activateNodeById(that.session, treeData, $(this).attr("id"));
          //delete that.session.tree;
          console.log(that.session.tree);
          //console.log(that.session.activeNode);
          that.$el.find("#treeview").html("");
          renderTree(that.session.tree);
      });

      if (graphid != 0) {
        $("#edit-graph").removeAttr("disabled");
        $("#edit-graph").click( function(){
          window.idAfter = graphid;
          findTreeDataParent(treeData, graphid);
          window.location.href = "/#/operation";
        });
      }
      else {
        $("#edit-graph").attr("disabled", "disabled");
      }

      $("#export-graph").click(function(){
        //console.log(that.session.activeNode.data);
        var dat = JSON.stringify(JSON.decycle(that.session.activeNode.data));
        Util.ajaxPOST("http://compute.getbombe.com/compute",
                        {
                          operation: "export_pdf",
                          data: dat
                        },
                        function(res){
                          //console.log(res);
                          Util.logAction(that.session.email, "Exported Graph", that.session.activeNode.data);
                          var filename = res.result.filename;
                          console.log(filename);
                          window.open("http://compute.getbombe.com/static/uploads/" + filename);
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
        Util.renderGraph(that.session.activeNode, "#plot-after");

        Util.activateNodeById(that.session, treeData, window.idBefore);
        Util.renderGraph(that.session.activeNode, "#plot-before");

        Util.logAction(that.session.email, "Created New Graph", "null");

        window.location.href = "/#/operation";
      });
      

      function renderTree(treeData) {

          console.log(treeData);

          that.$el.find("#treeview").html("");

          var tree = d3.layout.tree()
              .sort(null)
              .size([1000, 1000 - 20*10])
              .separation(function(a, b) { return (a.parent == b.parent ? 0.5 : 1); })
              .children(function(d)
              {
                  return (!d.data.children || d.data.children.length === 0) ? null : d.data.children;
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
                 .attr("id", function(d){return d.data.graphid})
               .attr("transform", function(d)
               {
                   return "translate(" + d.y + "," + d.x + ")";
               });

           nodeGroup.append("rect")
               .attr("class", "nodebox")
               .attr("x", -150/2)
               .attr("y", -100/2)
               .attr("width", 150)
               .attr("height", 100);

          Util.miniGraph(treeData);
        }
    }
  });

  return TreeView;
  
});

function writeTreeParent (id) {
    if (id != undefined && id != null) {
        window.idBefore = id;
        console.log("ParentID: " + id);
    }
}

function findTreeDataParent (tree, id) {
    
    currId = tree.data.graphid;

    if (tree.children instanceof Array) {
        tree.children.forEach( function(child){
            if (child.data.graphid == id) {
                writeTreeParent(currId);
                return;
            }
            else {
                findTreeDataParent (child, id); 
            }  
        });
    } 
}
