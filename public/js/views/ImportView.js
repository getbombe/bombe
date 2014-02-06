define([
  'jquery',
  'underscore',
  'backbone',
  'utility',
  'text!templates/import_view.html',
  'jquery.form'
], function($, _, Backbone, Util, DataImportTemplate){

  var ImportView = Backbone.View.extend({
    el: $("#import"),
    session: null,

    rendered: false,

    initialize: function(session){
      this.session = session;
    },

    render: function(){
      var template = _.template(DataImportTemplate, {data: null});
      this.$el.html(template);
      
      //In case user went back to this screen to edit root graph for reasons unknown...
      if (this.session.tree) {
        this.session.activeNode = this.session.tree;  
      }
      

      var that = this;

      $("#setup-graph").click(function() {
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

          Util.renderGraph(that.session.activeNode, "#import-preview", that.session);
        });
      });

      $(window).resize(function() {
        Util.renderGraph(that.session.activeNode, "#import-preview", that.session);
      })

      $("#setup-done").click(function() {
        window.location.href="/#/tree";
      });

      $('#tab1').click(function (e) {
          e.preventDefault();
          $('#tab1').tab('show');
      });
      $('#tab2').click(function (e) {
          e.preventDefault();
          $('#tab2').tab('show');
          Util.renderGraph(that.session.tree, "#import-preview", that.session);
      });

      // triggers
      // TODO: write these as events
      $("#inputfile").change(function(){
        $("#importform").ajaxSubmit({
          url: "../upload",
          type: "post",

          data: { email: that.session.email },

          error: function(xhr) {
            alert("error: could not import file");
          },

          success: function(response) {
            var res = response.tree;

            var tree = {};

            Util.logAction(that.session.email, "Uploaded Raw Data", "null");

            var data = {
              title: "Graph title - edit me",
              data: {
                x: res.x,
                y: res.y
              },
              unit: {
                x: "Units",
                y: "Units"
              },
              label: {
                x: "X-Data",
                y: "Y-Data"
              }
            };

            var newKey = that.session.saveGraphData(data);
            var newNode = {
              //userid: that.session.email,
              graphid: newKey,
              children: []
            }

            tree = newNode;

            // save initial tree
            Util.ajaxPOST("../newtree",
                          {
                            tree: JSON.stringify(tree),
                            email: that.session.email
                          },
                          function(){
                            //console.log("IMPORT: " + that.session.tree);
                            Util.logAction(that.session.email, "Uploaded Tree Data", JSON.stringify(tree));

                            that.session.tree = newNode;
                            that.session.activeNode = newNode;

                            $("#tab2").click();

                          },
                          function(){ console.log("error: failed to save initial tree"); },
                          function(){});
          }
        });
      });
    },

    hide: function(){
      this.$el.hide();
    },

    show: function(){
      this.$el.show();
      
      Util.logAction(this.session.email, "Viewed Import Page", "null");

      if(!this.rendered) {
        this.render();
        this.rendered = true;
      }
    }
  });

  return ImportView;
  
});
