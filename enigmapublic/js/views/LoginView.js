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
                          that.session.firstname = data.firstname;
                          that.session.lastname = data.lastname;
                          that.session.institution = data.institution;

                          //console.log(that.session.email);

                          Util.logAction(that.session.email, "Logged In", "null");

                          Util.ajaxPOST("../getalltrees",
                                        {
                                          email: that.session.email
                                        },
                                        function(data) {
                                          if (!data.success) console.log("all tree aren't successful... proceeding anyways");
                                          that.session.treeKeys = data.keys;
                                          that.session.treeNames = data.names;
                                          window.location.href = "/#/select";
                                        },
                                        function() { console.log("could not get all trees"); },
                                        function() {});

                          /*// get the tree
                          Util.ajaxPOST("../getTree",
                                        {
                                          email:that.session.email
                                        },
                                        function(data){ 
                                          // redirect upon login
                                          if (data.tree){
                                            //console.log("1");
                                            that.session.tree = JSON.parse(data.tree);
                                            //console.log("2");
                                            window.location.href = "/#/tree";
                                          }
                                          else {
                                            //console.log("3");
                                            window.location.href = "/#/import";
                                          }
                                        },
                                        function(){ console.log("could not get tree"); },
                                        function(){});
                          */
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

      $('.form-group').keypress(function(e) {
        if(e.which == 13) {
          e.preventDefault();
          $(this).blur();
          that.$el.find('#login').focus().click();
          return false;
        }
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

      Util.logAction(this.session.email, "Viewed Login Page", "null");

      if(!this.rendered) {
        this.render();
        this.rendered = true;
      }
    }
  });

  return LoginView;
  
});
