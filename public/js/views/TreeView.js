define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/tree_view.html'
], function($, _, Backbone, TreeViewTemplate){

  var TreeView = Backbone.View.extend({
    el: $("#dataimport"),
    
    initialize: function(){
    },

    render: function(){
      var template = _.template(TreeViewTemplate, {data: null});
      this.$el.html(template);
    },

    hide: function(){
      this.$el.hide();
    }

  });

  return TreeView;
  
});
