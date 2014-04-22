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
    
      Util.renderGraph(that.session.activeNode, "#plot-before", that.session);

      $(window).resize(function() {
        Util.renderGraph(that.session.activeNode, "#plot-before", that.session);
        Util.renderGraph(that.session.newNode, "#plot-after", that.session);
      });

      $("#operate-done").click( function() {
        window.location.href = "/#/tree";
        ga('send', 'event', 'button', 'click', 'operate');
      });


      $(".opbutton").click(function(){
        
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

        op = this.id;
        
      
        //Defaults
        data.res = 1;
        data.order = 1;
        data.sigma = 10;
        data.removal = 'none';
        data.E_zero = 0;
        data.power = 1;
        data.clip_min = Math.min.apply(Math, that.session.getGraphData(that.session.activeNode.graphid).data.x);
        data.clip_max = Math.max.apply(Math, that.session.getGraphData(that.session.activeNode.graphid).data.x);

        $("#operate-textbox").unbind();
        $("#operate-text").unbind();
        $("#operate-textbox2").unbind();
        $("#operate-options").hide();

        if(op == "stats_poly_regression"){
          
          $("#operate-options").show();
          $("#operate-textbox").html('<select id="smooth-select"><option value="none">None</option>'
           +'<option value="subtract">Subtraction</option>'
           +'<option value="divide">Division</option></select>');
          $("#operate-textbox").append('<input type="text" id="operate-text">');
          $("#operate-text").keyup(function() {
            data.removal = $("#smooth-select").val();
            if ($(this).val() == parseInt($(this).val())) {
              data.order = $(this).val();  
            } else {
              data.order = 1;
            }

            data.data.x = that.session.getGraphData(that.session.activeNode.graphid).data.x
            data.data.y = that.session.getGraphData(that.session.activeNode.graphid).data.y
            compute(op, data);
          });

          $("#smooth-select").on('change', function(){
            data.removal = $("#smooth-select").val();
            data.data.x = that.session.getGraphData(that.session.activeNode.graphid).data.x
            data.data.y = that.session.getGraphData(that.session.activeNode.graphid).data.y
            compute(op, data);
          });

          $("#operate-help").html("Choose polynomial order");
          $("#operate-explain").html("Uses a polynomial function of specified order to best fit the data. Default value is a linear (1st order) fit.");

        } else if(op == "calculus_differentiate") {
          
            $("#operate-explain").html("Uses a first-difference method to approximate the derivative of the dataset.");

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
          $("#operate-explain").html("Uses a cubic spline function to interpolate the dataset. Spline resolution acts as a multiplier for the number of data points (e.g. entering 2.0 would result in a spline with 2x the number of data points as the original dataset).");
        
        } else if(op == "background_spline_smooth"){
          
          $("#operate-options").show();
          $("#operate-textbox").html('<select id="smooth-select"><option value="none">None</option>'
           +'<option value="subtract">Subtraction</option>'
           +'<option value="divide">Division</option></select>');
          $("#operate-textbox").append('<input type="text" id="operate-text">');
          
          var splineCompute = function(){
            data.removal = $("#smooth-select").val();
            
            if ($("#operate-text").val() == parseFloat($("#operate-text").val())) {
              data.res = $("#operate-text").val();  
            } else {
              data.res = 1;
            }

            data.data.x = that.session.getGraphData(that.session.activeNode.graphid).data.x
            data.data.y = that.session.getGraphData(that.session.activeNode.graphid).data.y
            compute(op, data);
          };

          $("#smooth-select").on('change', splineCompute);
          $("#operate-text").on('keyup change', splineCompute);
          $("#operate-help").html("Choose removal type and enter smoothness parameter (larger = smoother)");
          $("#operate-explain").html("Smoothes the dataset using a spline. This smoothed spline can either be subtracted or divided from the original dataset.");

        } else if(op == "transform_fourier"){
          
          data.real = "True";
          $("#operate-explain").html("Performs a fourier transform on the dataset using the FFT algorithm. Only the positive part of the fourier transform are shown.");
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
          $("#operate-explain").html("Filters the dataset by multiplying the data with a gaussian window function with a specified sigma value.");
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
          $("#operate-help").html("Specify absorption edge energy");
          $("#operate-explain").html("An XAFS-specific function used to transform x-axis values (in eV) to k-space (in inverse Angstroms).");
        } else if(op == "transform_x_weight"){
          
          $("#operate-options").show();
          $("#operate-textbox").html('<input type="text" id="operate-text">');
          $("#operate-text").keyup(function() {
            if ($(this).val() == parseFloat($(this).val())) {
              data.power = $(this).val();  
            } else {
              data.power = 1;
            }

            data.data.x = that.session.getGraphData(that.session.activeNode.graphid).data.x
            data.data.y = that.session.getGraphData(that.session.activeNode.graphid).data.y
            compute(op, data);

          $("#operate-help").html("Specify X amplification exponent");
          $("#operate-explain").html("Multiplies all y-values by the corresponding x-value to the power specified. Used to amplify decaying signals.");
          });
        } else if(op == "minmax_clip"){
          $("#operate-options").show();
          $("#operate-textbox").html('<input type="text" id="operate-text1">');
          $("#operate-textbox2").html('<input type="text" id="operate-text2">');


          $("#operate-text1").keyup(function() {
            if ($(this).val() == parseFloat($(this).val())) {
              data.clip_min = $(this).val();  
            } else {
              data.clip_min = Math.min.apply(Math, that.session.getGraphData(that.session.activeNode.graphid).data.x);
            }

            data.data.x = that.session.getGraphData(that.session.activeNode.graphid).data.x
            data.data.y = that.session.getGraphData(that.session.activeNode.graphid).data.y
            compute(op, data);
          });

          $("#operate-text2").keyup(function() {
            if ($(this).val() == parseFloat($(this).val())) {
              data.clip_max = $(this).val();  
            } else {
              data.clip_max = Math.max.apply(Math, that.session.getGraphData(that.session.activeNode.graphid).data.x);
            }

            data.data.x = that.session.getGraphData(that.session.activeNode.graphid).data.x
            data.data.y = that.session.getGraphData(that.session.activeNode.graphid).data.y
            compute(op, data);
          });
          $("#operate-help").html("Indicate subset range to be clipped.");
          $("#operate-explain").html("Deletes all points where x-coordinate does not fall in between specified range.");
        } else if(op == "background_linear_subtract"){
          $("#operate-options").show();
          $("#operate-textbox").html('<input type="text" id="operate-text1">');
          $("#operate-textbox2").html('<input type="text" id="operate-text2">');
          $("#operate-textbox3").html('<input type="text" id="operate-text3">');
          $("#operate-textbox4").html('<input type="text" id="operate-text4">');


          $("#operate-text1").keyup(function() {
            if ($(this).val() == parseFloat($(this).val())) {
              data.x1 = $(this).val();  
            } else {
              data.x1 = 0;
            }

            data.data.x = that.session.getGraphData(that.session.activeNode.graphid).data.x
            data.data.y = that.session.getGraphData(that.session.activeNode.graphid).data.y
            compute(op, data);
          });

          $("#operate-text2").keyup(function() {
            if ($(this).val() == parseFloat($(this).val())) {
              data.y1 = $(this).val();  
            } else {
              data.y1 = 0;
            }

            data.data.x = that.session.getGraphData(that.session.activeNode.graphid).data.x
            data.data.y = that.session.getGraphData(that.session.activeNode.graphid).data.y
            compute(op, data);
          });

          $("#operate-text3").keyup(function() {
            if ($(this).val() == parseFloat($(this).val())) {
              data.x2 = $(this).val();  
            } else {
              data.x2 = 0;
            }

            data.data.x = that.session.getGraphData(that.session.activeNode.graphid).data.x
            data.data.y = that.session.getGraphData(that.session.activeNode.graphid).data.y
            compute(op, data);
          });

          $("#operate-text4").keyup(function() {
            if ($(this).val() == parseFloat($(this).val())) {
              data.y2 = $(this).val();  
            } else {
              data.y2 = 0;
            }

            data.data.x = that.session.getGraphData(that.session.activeNode.graphid).data.x
            data.data.y = that.session.getGraphData(that.session.activeNode.graphid).data.y
            compute(op, data);
          });

          $("#operate-help").html("Indicate x and y coordinates for fitting the line to subtract.");
          $("#operate-explain").html("Fits a linear function to two specified points, then subtracts the line from the data.");
        } else {
          // select
        }

        compute(op, data);

    $("#operate-done").prop("disabled",false);
      });

      function compute (op, data){
        if(op && data){
          $("#plot-after").html("Loading...");
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
                          $("#xymin-display").html(parseFloat(res.result.data.xAtYMin[0]).toFixed(3));
                          $("#ymin-display").html(parseFloat(res.result.data.yMin[0]).toFixed(3));
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
                          $("#xymax-display").html(parseFloat(res.result.data.xAtYMax[0]).toFixed(3));
                          $("#ymax-display").html(parseFloat(res.result.data.yMax[0]).toFixed(3));
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
