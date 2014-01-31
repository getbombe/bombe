define([
  'jquery',
  'underscore',
  'backbone',
  'utility',
  'text!templates/register_view.html'
], function($, _, Backbone, Util, RegisterViewTemplate){

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

      // register button triggers
      var that = this;
      this.$el.find("#register").click(function(){
        var email = that.$el.find("input#email").val();
        var password = that.$el.find("input#password").val();
        var firstname = that.$el.find("input#firstname").val();
        var lastname = that.$el.find("input#lastname").val();
        var institution = that.$el.find("input#institution").val();

        Util.ajaxPOST('../register',
                     {
                        email: email,
                        password: password,
                        firstname: firstname,
                        lastname: lastname,
                        institution: institution
                     },
                     function(data){
                        if(data.success){
                          that.session.isLoggedIn = true;
                          that.session.email = email;
                          that.session.apiKey = data.key;
                          window.location.href = "/#/import";
                        } else {
                          that.displayErrorMessage();
                        }
                     },
                     function(err){
                        console.log("Server connection failed");
                     },
                     function(){}
                    );

      });
    },

    displaySuccessMessage: function(){
      this.$el.find("div.errordisplay").hide();
      this.$el.find("div.successdisplay").show().html("Welcome to Bombe! <a href='#/login'>Please login here.</a>");
    },

    displayErrorMessage: function(){
      this.$el.find("div.errordisplay").show().html("Please enter all mandatory fields.");
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
