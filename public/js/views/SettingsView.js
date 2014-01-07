define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/settings_view.html'
], function($, _, Backbone, SettingsViewTemplate){

  var SettingsView = Backbone.View.extend({
    el: $("#settings"),
    session: null,

    rendered: false,
    
    initialize: function(session){
      this.session = session;
    },

    render: function(){
      var template = _.template(SettingsViewTemplate, {data: null});
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

  return SettingsView;
  
});
