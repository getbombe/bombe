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
      
      var that = this;

      // triggers
      // TODO: write these as events
      this.$el.find("form#importform").change(function(){
        $(this).ajaxSubmit({
          url: "../upload",
          type: "post",

          data: { email: that.session.email },

          error: function(xhr) {
            alert("error: cound not import file");
          },

          success: function(response) {
            var res = response.tree;

            var tree = {};

            var data = {
              "userid": that.session.email,
              "graphid": "-1", //TODO
              "data": {
                "x": res.x,
                "y": res.y
              },
              "unit": {
                "x": "todoooo",
                "y": "todoooo"
              },
              "label": {
                "x": "TODOOO",
                "y": "TODOOO"
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
                          function(){},
                          function(){ console.log("failed to save initital tree"); },
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
