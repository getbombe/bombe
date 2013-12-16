define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){

  var BodyView = Backbone.View.extend({
    el: $("#body"),
    
    initialize: function(){
    },

    render: function(){
      this.$el.html("IM ALIVE");
    }

  });

  return BodyView;
  
});
