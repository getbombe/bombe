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
      //console.log(this.session);
      this.session = session;
    },

    render: function(){
      var template = _.template(DataImportTemplate, {data: null});
      this.$el.html(template);
      
      var that = this;

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

            var data = {
              "userid": that.session.email,
              "graphid": "0", //TODO
              "data": {
                "x": res.x,
                "y": res.y
              },
              "unit": {
                "x": "Units",
                "y": "Units"
              },
              "label": {
                "x": "X-Label",
                "y": "Y-Label"
              }
            };

            tree.data = data;
            tree.children = [];

            //that.session.tree = tree;

            // save initial tree
            Util.ajaxPOST("../newtree",
                          {
                            tree: JSON.stringify(tree),
                            email: that.session.email
                          },
                          function(){},
                          function(){ console.log("error: failed to save initial tree"); },
                          function(){});

            //Draw uploaded graph
            // $("#upload").css("background", "#fff");
            // Util.renderGraph(tree, 0, "#upload");

            // $(window).resize( function () {
            //   Util.renderGraph(tree, 0, "#upload");
            // });
            console.log("IMPORT: " +that.session.tree);
            window.location.href = "/#/tree";
          }
        });
      });
      
      
      //this.session.tree = that.session.tree;
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

  return ImportView;
  
});
