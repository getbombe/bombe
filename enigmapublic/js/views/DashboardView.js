define([
  'jquery',
  'jqueryui',
  'underscore',
  'backbone',
  'text!templates/dashboard_view.html', 
  'bootstrap'
], function($, jqueryui, _, Backbone, DashboardViewTemplate, Bootstrap){
	var DashboardView = Backbone.View.extend({
		el: $("#dashboard"),
    session: null,

    rendered: false,
    
    initialize: function(session){
      this.session = session;
    },

    render: function(){
      var template = _.template(DashboardViewTemplate, {data: null});
      this.$el.html(template);

      var randNum = function() {
        return Math.floor(Math.random() * 90) + 1;
      }

      $(".progressbar").each(
        function(index){
          $(this).progressbar({
            value: randNum()
          });
        }
      );
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

  return DashboardView;
});