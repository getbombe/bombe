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
      //console.log(this.session);
      this.session = session;
    },

    render: function(){
      var template = _.template(TreeViewTemplate, {data: null});
      this.$el.html(template);

      var that = this;
      // get the tree
      Util.ajaxPOST("../getTree",
                    {
                      email:that.session.email
                    },
                    function(data){ that.session.tree = data.tree; },
                    function(){ console.log("could not get tree"); },
                    function(){});

      try {
        console.log("TREE: " + that.session.tree);
        var treeData = JSON.parse(that.session.tree); 

       } 
       catch (e) {
         //window.location.replace("/#/import");
         //console.log(e);
         return;
       }

      //console.log(treeData);

      window.idBefore = null;
      window.idAfter = null;
      // if ($('#plot-preview').height() != 0) {
      //     window.opHeight = $('#plot-preview').height();
      //     window.opWidth = $('#plot-preview').width();
      // }
      renderTree(treeData);
      Util.renderGraph(treeData, 0, "#plot-preview");

      var graphid = parseFloat($("#plot-preview-titlebar .graphid").html());

      $(window).resize(function() {
      //     if ($('#plot-preview').height() != 0) {
      //         window.opHeight = $('#plot-preview').height();
      //         window.opWidth = $('#plot-preview').width();
      //     }
          Util.renderGraph(treeData, 0, "#plot-preview"); 
          //console.log("test");
      });

      $(".node").click( function(){
          //console.log($(this).attr("id"));
          Util.renderGraph(treeData, $(this).attr("id"), "#plot-preview");
      });

      $("#delete-graph").click( function(){
          console.log("deleted:" + graphid);
          treeData = prune(treeData, graphid);
          console.log(that.session);
          that.session.tree = JSON.stringify(treeData);
          renderTree(treeData);
      });

      if (graphid != 0) {
        $("#edit-graph").removeAttr("disabled");
        $("#edit-graph").click( function(){
          window.idAfter = graphid;
          findTreeDataParent(treeData, graphid);
          //console.log(window.idBefore);
          //console.log (window.idAfter);
          //Util.renderGraph(treeData, window.idBefore, "#plot-before");
          //Util.renderGraph(treeData, window.idAfter, "#plot-after");
          window.location.href = "/#/operation";
          //console.log("edited:" + ".node #" + graphid);
          //console.log(d3.selectAll(".node")[0][graphid]);
          //console.log(d3.selectAll(".node")[0][graphid].parentNode);
        });
      }
      else {
        $("#edit-graph").attr("disabled", "disabled");
      }

      $("#create-graph").click ( function(){
        var graphid = parseFloat($("#plot-preview-titlebar .graphid").html());
        window.idBefore = graphid;
        window.idAfter = "new";
        Util.renderGraph(treeData, window.idBefore, "#plot-before");
        Util.renderGraph(treeData, window.idAfter, "#plot-after");
        window.location.href = "/#/operation";
      });

      function renderTree(treeData) {

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

            //console.log(nodes);

          /*
               <svg>
                   <g class="container" />
               </svg>
            */
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

           /*
               Nodes as
               <g class="node">
                   <circle class="node-dot" />
                   <text />
               </g>
            */

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

            // nodes.forEach( function(node){ 
            //     node.attr("id", node.data.graphid)
            // });

           nodeGroup.append("rect")
               .attr("class", "nodebox")
               .attr("x", -150/2)
               .attr("y", -100/2)
               .attr("width", 150)
               .attr("height", 100);

            //data = "/uploads/data.tsv"

          Util.miniGraph(treeData);
        }

    },

    hide: function(){
      this.$el.hide();
    },

    show: function(){
      this.$el.show();
      this.render();
      // if(!this.rendered) {
      //   this.render();
      //   this.rendered = true;
      // }
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
