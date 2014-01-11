define([
  'jquery',
  'underscore',
  'backbone',
  'utility',
  'text!templates/profile_view.html'
], function($, _, Backbone, Util, ProfileViewTemplate){

  var ProfileView = Backbone.View.extend({
    el: $("#profile"),
    session: null,

    rendered: false,
    
    initialize: function(session){
      this.session = session;
    },

    render: function(){
      var template = _.template(ProfileViewTemplate, {data: null});
      this.$el.html(template);
      $("#user-email").html(this.session.email);
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

      var op = 'calculus_differentiate';
      var data = {
        'userid': '0001',
        'graphid': '1234',
        'data' : {
          'x' : ['1', '2', '3'],
          'y' : ['4.5', '-3', '0']
        },
        'unit' : {
          'x' : 'km',
          'y' : 'km/h'
        },
        'param1' : 'value1',
        'param2' : 'value2'
      };




    }
  });

  return ProfileView;
  
});
