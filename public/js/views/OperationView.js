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

      $("#operate-options").hide();
    
      Util.renderGraph(that.session.activeNode, "#plot-before", that.session);

      $(window).resize(function() {
        Util.renderGraph(that.session.activeNode, "#plot-before", that.session);
        Util.renderGraph(that.session.newNode, "#plot-after", that.session);
      });

      $("#operate-done").click( function() {
        window.location.href = "/#/tree";
        ga('send', 'event', 'button', 'click', 'operate');
      });


      this.$el.find("select#opselect").change(function(){
        
    $("#operate-done").prop("disabled",true);
        var op = false;
        var data = {
            title: "New Graph",
            data : {
              x : that.session.getGraphData(that.session.activeNode.graphid).data.x,
              y : that.session.getGraphData(that.session.activeNode.graphid).data.y
            },
            unit : {
                x : "Units",
                y : "Units"
            },
            label : {
                x : "X-Data",
                y : "Y-Data"
            }
        };

        op = this.value;
        $("#operate-options").hide();
      
        //Defaults
        data.res = 1;
        data.order = 1;
        data.sigma = 10;
        data.removal = 'none';
        data.E_zero = 0;
        data.power = 1;
        $("#operate-textbox").unbind();
        $("#operate-text").unbind();

        if(op == "stats_poly_regression"){
          $("#operate-options").show();
          $("#operate-textbox").html('<input type="text" id="operate-text">');
          $("#operate-text").keyup(function() {
            if ($(this).val() == parseInt($(this).val())) {
              data.order = $(this).val();  
            } else {
              data.order = 1;
            }

            data.data.x = that.session.getGraphData(that.session.activeNode.graphid).data.x
            data.data.y = that.session.getGraphData(that.session.activeNode.graphid).data.y
            compute(op, data);
          });
          $("#operate-help").html("Choose polynomial order");

        } else if(op == "background_spline"){
          $("#operate-options").show();
          $("#operate-textbox").html('<input type="text" id="operate-text">');
          $("#operate-text").keyup(function() {
            if ($(this).val() == parseFloat($(this).val())) {
              data.res = $(this).val();  
            } else {
              data.res = 1;
            }

            data.data.x = that.session.getGraphData(that.session.activeNode.graphid).data.x
            data.data.y = that.session.getGraphData(that.session.activeNode.graphid).data.y
            compute(op, data);
          });
          $("#operate-help").html("Choose spline resolution (larger = more spline points)");
        } else if(op == "transform_fourier"){
          data.real = "True";
        } else if(op == "transform_gaussian_filter"){
          $("#operate-options").show();
          $("#operate-textbox").html('<input type="text" id="operate-text">');
          $("#operate-text").keyup(function() {
            if ($(this).val() == parseFloat($(this).val())) {
              data.sigma = $(this).val();  
            } else {
              data.sigma = 1;
            }

            data.data.x = that.session.getGraphData(that.session.activeNode.graphid).data.x
            data.data.y = that.session.getGraphData(that.session.activeNode.graphid).data.y
            compute(op, data);
          });
          $("#operate-help").html("Choose sigma value");
        } else if(op == "transform_k_space_transform"){
          $("#operate-options").show();
          $("#operate-textbox").html('<input type="text" id="operate-text">');
          $("#operate-text").keyup(function() {
            if ($(this).val() == parseFloat($(this).val())) {
              data.E_zero = $(this).val();  
            } else {
              data.E_zero = 0;
            }

            data.data.x = that.session.getGraphData(that.session.activeNode.graphid).data.x
            data.data.y = that.session.getGraphData(that.session.activeNode.graphid).data.y
            compute(op, data);
          });
          $("#operate-help").html("Choose sigma value");
        } else {
          // select
        }

        compute(op, data);

    $("#operate-done").prop("disabled",false);
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
                          Util.renderGraph({data: data}, "#plot-after", false);

                          updateMinMax(data); 

                          var newKey = that.session.saveGraphData(data);
                          var newNode = {
                            graphid: newKey,
                            children: []
                          }
                          that.session.newNode = newNode;
                        },
                        function(){ console.log("Compute failed."); },
                        function(){});
        }
      };

      function updateMinMax (data){
        if(data){
          Util.ajaxPOST("http://compute.getbombe.com/compute",
                        {
                          operation: "minmax_min",
                          data: JSON.stringify(JSON.decycle(data))
                        },
                        function(res){
                          Util.logAction(that.session.email, "Transformed Graph", "minmax_min");
                          $("#xymin-display").html(res.result.data.xAtYMin[0]);
                          $("#ymin-display").html(res.result.data.yMin[0]);
                          $("#minmax-display").show();
                        },
                        function(){ console.log("Min compute failed."); },
                        function(){});

          Util.ajaxPOST("http://compute.getbombe.com/compute",
                        {
                          operation: "minmax_max",
                          data: JSON.stringify(JSON.decycle(data))
                        },
                        function(res){
                          Util.logAction(that.session.email, "Transformed Graph", "minmax_max");
                          $("#xymax-display").html(res.result.data.xAtYMax[0]);
                          $("#ymax-display").html(res.result.data.yMax[0]);
                          $("#minmax-display").show();
                        },
                        function(){ console.log("Min compute failed."); },
                        function(){});
        }
      };
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
