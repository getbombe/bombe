define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/data_import.html'
], function($, _, Backbone, DataImportTemplate){

  var ImportView = Backbone.View.extend({
    el: $("#dataimport"),
    session: null,

    rendered: false,

    initialize: function(session){
      this.session = session;
    },

    render: function(){
      var template = _.template(DataImportTemplate, {data: null});
      this.$el.html(template);
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
