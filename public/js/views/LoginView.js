define([
  'jquery',
  'underscore',
  'backbone',
  'utility',
  'text!templates/login_view.html'
], function($, _, Backbone, Util, LoginViewTemplate){

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

      // login button triggers
      var that = this;
      this.$el.find("#login").click(function(){
        var email = that.$el.find("input#email").val();
        var password = that.$el.find("input#password").val();

        Util.ajaxPOST('../login',
                     {
                        email: email,
                        password: password
                     },
                     function(data){
                        if(data.success){
                          that.session.isLoggedIn = true;
                          that.session.email = email;
                          that.session.apiKey = data.key;

                          // redirect upon login
                          window.location.href = "#/tree";
                        } else {
                          that.displayErrorMessage(data.error);
                        }
                     },
                     function(err){
                        console.log("Server connection failed");
                     },
                     function(){}
                    );

      });
    },

    displayErrorMessage: function(message){
      this.$el.find("div.errordisplay").show().html("Error: " + message);
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
