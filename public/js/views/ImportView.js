define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/data_import.html'
], function($, _, Backbone, DataImportTemplate){

  var BodyView = Backbone.View.extend({
    el: $("#dataimport"),
    
    initialize: function(){
    },

    render: function(){
      var template = _.template(DataImportTemplate, {data: null});
      this.$el.html(template);
    }

  });

  return BodyView;
  
});
