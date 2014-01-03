define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/tree_view.html'
], function($, _, Backbone, TreeViewTemplate){

  var TreeView = Backbone.View.extend({
    el: $("#dataimport"),
    session: null,

    rendered: false,
    
    initialize: function(session){
      this.session = session;
    },

    render: function(){
      var template = _.template(TreeViewTemplate, {data: null});
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

  return TreeView;
  
});
