define([
  'jquery',
  'underscore',
  'backbone',
  'utility',
  'text!templates/operation_view.html'
], function($, _, Backbone, Util, OperationViewTemplate){

  var OperationView = Backbone.View.extend({
    el: $("#operation"),
    session: null,

    rendered: false,
    
    initialize: function(session){
      this.session = session;
    },

    render: function(){
      var template = _.template(OperationViewTemplate, {data: null});
      this.$el.html(template);

      var that = this;
      // get the tree
      // Util.ajaxPOST("../getTree",
      //               {
      //                 email:that.session.email
      //               },
      //               function(data){ that.session.tree = data.tree; },
      //               function(){ console.log("could not get tree"); },
      //               function(){});

      try {
        console.log("OPERATION: " + this.session.tree);
        var treeData = JSON.parse(this.session.tree); 

       } 
       catch (e) {
         //window.location.replace("/#/tree");
         console.log(e);
         return;
       }

      // if ($('#plot-before').height() != 0) {
      //   window.opHeight = $('#plot-before').height();
      //   window.opWidth = $('#plot-before').width();
      // }
      Util.renderGraph(treeData, window.idBefore, "#plot-before");
      Util.renderGraph(treeData, window.idAfter, "#plot-after");

      $(window).resize(function() {
   
      //   if ($('#plot-before').height() != 0) {
      //     window.opHeight = $('#plot-before').height();
      //     window.opWidth = $('#plot-before').width();
      // }
        Util.renderGraph(treeData, window.idBefore, "#plot-before");
        Util.renderGraph(treeData, window.idAfter, "#plot-after");
          //console.log("test");
      });


      this.$el.find("select#opselect").change(function(){
        alert(this.value);
      });
    },

    hide: function(){
      this.$el.hide();
    },

    show: function(){
      this.$el.show();
      this.render();
      // if(!this.rendered) {
      //   this.render();
      //   this.rendered = true;
      // }
    }
  });

  return OperationView;
  
});
