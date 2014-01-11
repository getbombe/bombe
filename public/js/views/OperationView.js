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

      $("#operate-done").click( function() {
        window.location.href = "/#/tree";
      });


      this.$el.find("select#opselect").change(function(){
        var op = false;
        var data = {
            'data' : {
              'x' : that.session.activeNode.data.data.x,
              'y' : that.session.activeNode.data.data.y
            },
            "unit" : {
                "x" : "Units",
                "y" : "Units"
            },
            "label" : {
                "x" : "X-Label",
                "y" : "Y-Label"
            },
        };

        if(this.value == "calculus_differentiate"){
          op = "calculus_differentiate";
        } else if(this.value == "stats_poly_regression_reg"){
          op = "stats_poly_regression";
          data.order = 1;
          data.res = 1;
        } else if(this.value == "stats_poly_regression_spl"){
          op = "background_spline";
          data.res = 1;
        } else if(this.value == "transform_fourier"){
          op = "transform_fourier";
          data.real = "True";
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
                          //console.log(res);
                          data.data = res.result.data;
                          data.graphid = Math.floor(Math.random() * (100000000 -  + 1)) + 1;
                          Util.renderGraph({data: data}, "#plot-after");
                          that.session.newNode = {data: data};
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
