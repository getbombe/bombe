define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){

  var BodyView = Backbone.View.extend({
    el: $("#body"),
    session: null,
    
    initialize: function(session){
      this.session = session;
    },

    render: function(){
    }

  });

  return BodyView;
  
});
