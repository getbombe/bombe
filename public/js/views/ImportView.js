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
                "x": "X-Data",
                "y": "Y-Data"
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
                          function(){
                            console.log("IMPORT: " + that.session.tree);
                            that.session.tree = JSON.stringify(tree);
                            window.location.href = "/#/tree";
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
      
      if(!this.rendered) {
        this.render();
        this.rendered = true;
      }
    }
  });

  return ImportView;
  
});
