define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/register_view.html'
], function($, _, Backbone, RegisterViewTemplate){

  var RegisterView = Backbone.View.extend({
    el: $("#registration"),
    session: null,

    rendered: false,

    initialize: function(session){
      this.session = session;
    },

    render: function(){
      var template = _.template(RegisterViewTemplate, {data: null});
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

  return RegisterView;
  
});
