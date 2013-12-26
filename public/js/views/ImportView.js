define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/data_import.html'
], function($, _, Backbone, DataImportTemplate){

  var ImportView = Backbone.View.extend({
    el: $("#dataimport"),
    
    initialize: function(){
    },

    render: function(){
      this.$el.show();
      var template = _.template(DataImportTemplate, {data: null});
      this.$el.html(template);
    },

    hide: function(){
      this.$el.hide();
    }

  });

  return ImportView;
  
});
