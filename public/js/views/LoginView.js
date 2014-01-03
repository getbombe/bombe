define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/login_view.html'
], function($, _, Backbone, LoginViewTemplate){

  var LoginView = Backbone.View.extend({
    el: $("#login"),
    session: null,

    rendered: false,

    initialize: function(session){
      this.session = session;
    },

    render: function(){
      var template = _.template(LoginViewTemplate, {data: null});
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

  return LoginView;
  
});
