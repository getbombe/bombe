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

      $("#setup-graph").click(function() {
        this.blur();
        $("#setupModal").modal({
          remote: false
        });  
      });

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
          Util.renderGraph(that.session.tree, "#import-preview");
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
              "userid": that.session.email,
              "graphid": "1", //TODO
              "data": {
                "x": res.x,
                "y": res.y
              },
              "unit": {
                "x": "Units",
                "y": "Units"
              },
              "label": {
                "x": "X-Data",
                "y": "Y-Data"
              }
            };

            tree.data = data;
            tree.children = [];

            // save initial tree
            Util.ajaxPOST("../newtree",
                          {
                            tree: JSON.stringify(tree),
                            email: that.session.email
                          },
                          function(){
                            //console.log("IMPORT: " + that.session.tree);
                            Util.logAction(that.session.email, "Uploaded Tree Data", JSON.stringify(tree));

                            that.session.tree = tree;

                            // $("#tab2").tab("show", function() {
                            //   Util.renderGraph(tree, "#import-preview");
                            // });
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
