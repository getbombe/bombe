define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/operation_view.html'
], function($, _, Backbone, OperationViewTemplate){

  var OperationView = Backbone.View.extend({
    el: $("#dataimport"),
    
    initialize: function(){
    },

    render: function(){
      this.$el.show();
      var template = _.template(OperationViewTemplate, {data: null});
      this.$el.html(template);
    },

    hide: function(){
      this.$el.hide();
    }

  });

  return OperationView;
  
});
