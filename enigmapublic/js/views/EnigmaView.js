define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/enigma_view.html', 
  'bootstrap'
], function($, _, Backbone, EnigmaViewTemplate, Bootstrap){
	var EnigmaView = Backbone.View.extend({
		el: $("#enigma"),
    session: null,

    rendered: false,
    
    initialize: function(session){
      this.session = session;
    },

    render: function(){
      var template = _.template(EnigmaViewTemplate, {data: null});
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

  return EnigmaView;
});