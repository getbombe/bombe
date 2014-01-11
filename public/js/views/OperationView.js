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
      Util.renderGraph(that.session.activeNode, "#plot-before");

      $(window).resize(function() {
   
      //   if ($('#plot-before').height() != 0) {
      //     window.opHeight = $('#plot-before').height();
      //     window.opWidth = $('#plot-before').width();
      // }
        Util.renderGraph(that.session.activeNode, "#plot-before");
        Util.renderGraph(that.session.newNode, "#plot-after");
          //console.log("test");
      });


      this.$el.find("select#opselect").change(function(){
        var op = false;
        var data = {
            'data' : {
              'x' : that.session.activeNode.data.data.x,
              'y' : that.session.activeNode.data.data.y
            }
        };

        if(this.value == "calculus_differentiate"){
          op = "calculus_differentiate";
        } else if(this.value == "stats_poly_regression_reg"){
          op = "stats_poly_regression";
          data.order = 1;
          data.res = 10;
        } else if(this.value == "stats_poly_regression_spl"){
          op = "stats_poly_regression";
          data.res = 10;
        } else if(this.value == "transform_fourier"){
          op = "transform_fourier";
          real = "True";
        } else {
          // select
        }

        if(op){
          Util.ajaxPOST("http://compute.getbombe.com/compute",
                        {
                          operation: op,
                          data: JSON.stringify(data)
                        },
                        function(res){ 
                          data.data = res.result.data;
                          Util.renderGraph(data, "#plot-after");
                          that.session.newNode = data;
                        },
                        function(){ console.log("Compute failed."); },
                        function(){});
        }
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
