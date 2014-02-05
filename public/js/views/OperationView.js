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
        var op = false;
        var data = {
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

            compute(op, data);
          });
          $("#operate-help").html("(Choose polynomial order)");

        } else if(op == "background_spline"){

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

            compute(op, data);
          });
          $("#operate-help").html("(Choose sigma value)");
        } else if(op == "background_spline_smooth"){
          $("#operate-options").show();
          $("#operate-textbox").html('<select id="smooth-select"><option value="none">None</option>'
           +'<option value="subtract">Subtraction</option>'
           +'<option value="divide">Division</option></select>');
          $("#smooth-select").change(function(){
        
          data.removal = $("#smooth-select").val();

          compute(op, data);
        
          });
          $("#operate-help").html("(Choose BG removal)");
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
                          Util.renderGraph({data: data}, "#plot-after", false);

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
