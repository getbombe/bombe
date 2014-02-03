define([
  'jquery',
  'underscore',
  'backbone',
  'utility',
  'bootstrap',
  'slider',
  'text!templates/operation_view.html'
], function($, _, Backbone, Util, Bootstrap, Slider, OperationViewTemplate){

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
    
      Util.renderGraph(that.session.activeNode, "#plot-before");

      $(window).resize(function() {
        Util.renderGraph(that.session.activeNode, "#plot-before");
        Util.renderGraph(that.session.newNode, "#plot-after");
      });

      $("#operate-done").click( function() {
        window.location.href = "/#/tree";
        ga('send', 'event', 'button', 'click', 'operate');
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
                "x" : "X-Data",
                "y" : "Y-Data"
            },
            "userid" : that.session.email
        };

        op = this.value;
        $(".slider").hide();
        $("#operate-slider").unbind();

        if(op == "stats_poly_regression"){
          $(".slider").show();
          $("#operate-slider").unbind();
          $("#operate-slider").slider({
            min: "1",
            max: "10",
            step: "1",
            value: "1",
            tooltip: "show"
          });
          $("#operate-help").html("<p>Choose polynomial order</p>");
          $("#operate-slider").on("slideStop", function(){
            data.order = parseFloat($(".tooltip-inner").html());
            data.data.x = that.session.activeNode.data.data.x;
            data.data.y = that.session.activeNode.data.data.y;
            compute(op, data);
          });
          data.order = 1;
          data.res = 1;
        } else if(op == "background_spline"){
          $(".slider").show();
          $("#operate-slider").unbind();
          $("#operate-slider").slider({
            min: "1",
            max: "20",
            step: "1",
            value: "10",
            tooltip: "show"
          });
          $("#operate-help").html("<p>Choose spline roughness</p>");
          $("#operate-slider").on("slideStop", function(){
            data.res = parseFloat($(".tooltip-inner").html()) / 10.0;
            data.data.x = that.session.activeNode.data.data.x;
            data.data.y = that.session.activeNode.data.data.y;
            compute(op, data);
          });
          data.res = 1;
          
        } else if(op == "transform_fourier"){
          data.real = "True";
        } else if (op == "transform_gaussian_filter") {
          $(".slider").show();
          $("#operate-slider").unbind();
          $("#operate-slider").slider({
            min: "1",
            max: "100",
            step: "10",
            value: "10",
            tooltip: "show"
          });
          $("#operate-help").html("<p>Choose gaussian sigma-value</p>");
          $("#operate-slider").on("slideStop", function(){
            data.res = parseFloat($(".tooltip-inner").html());
            data.data.x = that.session.activeNode.data.data.x;
            data.data.y = that.session.activeNode.data.data.y;
            compute(op, data);
          });
          data.sigma = 10;
        } else if (op == "background_spline_smooth") {
          data.res = 1;
          data.removal = 'subtract';
        } else {
          // select
        }

        compute(op, data);

      });

      function compute (op, data){
        if(op && data){
          Util.ajaxPOST("http://compute.getbombe.com/compute",
                        {
                          operation: op,
                          data: JSON.stringify(JSON.decycle(data))
                        },
                        function(res){
                          Util.logAction(that.session.email, "Transformed Graph", $("#opselect").value);
                          data.data = res.result.data;
                          data.graphid = Math.floor(Math.random() * (100000000 - 1)) + 1;
                          Util.renderGraph({data: data}, "#plot-after");
                          that.session.newNode = {data: data};
                        },
                        function(){ console.log("Compute failed."); },
                        function(){});
        }
      }

    },

    hide: function(){
      this.$el.hide();
    },

    show: function(){
      this.$el.show();

      Util.logAction(this.session.email, "Viewed Operation Page", "null");

      this.render();
       if(!this.rendered) {
         this.render();
         this.rendered = true;
       }
    }
  });

  return OperationView;
  
});
