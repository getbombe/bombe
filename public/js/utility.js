/*
 * Bombe utility library
 */

define([
	'jquery',
	'underscore',
	'backbone',
	'highcharts'
], function($, _, Backbone, highcharts) {
	var utility = {
		ajaxGET: function(dest, data, onDone, onFail, onAlways){
			$.ajax({
				type: "GET",
				url: dest,
				data: data
			})
			.done(onDone)
			.fail(onFail)
			.always(onAlways);
		},

		ajaxPOST: function(dest, data, onDone, onFail, onAlways){
			$.ajax({
				type: "POST",
				url: dest,
				data: data
			})
			.done(onDone)
			.fail(onFail)
			.always(onAlways);
		},

		logAction: function(email, useraction, entity){
			this.ajaxPOST("/log",
						  {
						  	email: email,
						  	useraction: useraction,
						  	entity: entity
						  },
						  function(){},
						  function(){ console.log("Did not log correctly"); },
						  function(){});
		},

		activateNodeById: function(session, tree, id){
		 	var that = this;
			if (tree.graphid == id && id != null && id != undefined) {
				//console.log(session);
				session.activeNode = tree;
				//console.log(session.activeNode);
			}
			else if (tree.children instanceof Array) {
				tree.children.forEach( function(child){
					//console.log("recur");
				  that.activateNodeById(session, child, id); 
				});
			}
		},

		deleteNode: function(tree, graphid){
			if (!(tree.children instanceof Array)) return false;

			for (var i = 0; i < tree.children.length; i++) {
				if (tree.children[i].graphid == graphid){
					tree.children.splice(i,1);
					return true;
				} else {
					if (this.deleteNode(tree.children[i], graphid)) return true;
				}
			}

			return false;
		},

		renderGraph: function(graph, viewid, session) {
			console.log(graph);

			if (graph == null) return;

			$(viewid).html('');

			var id = graph.graphid;
			var that = this;

			// hacky as hell. need to refactor. TODO....
			var data = session ? session.getGraphData(id) : graph.data;

			var datalist = [];
			for(var i = 0; i < data.data.x.length; i++) {
				var datapoint = [data.data.x[i], data.data.y[i]];
				datalist.push(datapoint);
			}

	        $("div" + viewid).highcharts({
	            title: {
	                text: data.title,
	                x: -20 //center
		        },
	            chart: {
	                zoomType: 'xy',
	            },
	            xAxis: {
	                title: {
	                    text: data.label.x + " (" + data.unit.x + ")",
	                }
	            },
	            yAxis: {
	                title: {
	                    text: data.label.y + " (" + data.unit.y + ")",
	                }
	            },
	            tooltip: {
	                shared: true,
	                formatter: function() {
		                return '<b>('+ this.x +
		                    ' , '+ this.y +')</b>';
		            }
	            },
	            plotOptions: {
				    line: {
				        marker: {
				            enabled: false
				        }
				    }
	            },
	            legend: {
	                enabled: false
	            },
	            credits: {
				    enabled: false
				},
	    
	            series: [{
	                data: datalist
	            }]
	        });
    

	/*
				if (graph == null) {
					return;
				}

				$(viewid).html('');

				var titleid = viewid + "-titlebar";
				var id = graph.graphid;

				var that = this;

				$(titleid + " .graphid").html("New Graph");
				if (session)
					$(titleid + " .graphid").html(session.getGraphData(id).title);

				var margin = {top: 20, right: 20, bottom: 40, left: 70};
			    var width = $(viewid).width() - margin.left - margin.right;
			    var height = $(viewid).height() - margin.top - margin.bottom;

				var x = d3.scale.linear()
				    .range([0, width]);

				var y = d3.scale.linear()
				    .range([height, 0]);

				var xAxis = d3.svg.axis()
				    .scale(x)
				    .orient("bottom");

				var yAxis = d3.svg.axis()
				    .scale(y)
				    .orient("left");

				var line = d3.svg.line()
				    .x(function(d) { return x(d.x); })
				    .y(function(d) { return y(d.y); });

				var svg = d3.select(viewid).append("svg")
				    .attr("width", width + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom)
				  	.append("g")
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				// for new operation, directly input data. VERY hacky. TODO...
				var xyData = session ? session.getGraphData(graph.graphid) : graph.data;
				
				xData = xyData.data.x.map(function(d){return parseFloat(d)});
				yData = xyData.data.y.map(function(d){return parseFloat(d)});

				data = [];

				for (i = 0; i < xData.length; i++) {
					var row = {
						"x": xData[i],
						"y": yData[i]
					}
					data.push (row);			
				}

				x.domain(d3.extent(xData));
				y.domain(d3.extent(yData));
			
				svg.append("g")
				    .attr("class", "x axis")
				    .attr("transform", "translate(0," + height + ")")
				    .call(xAxis)
				    .append("text")
				    .attr("class", "axisLabel")
				    .attr("x", width)
				    .attr("dy", "2.7em")
				    .style("text-anchor", "end")
				    .text(xyData.label.x + " (" + xyData.unit.x + ")");

				  svg.append("g")
				    .attr("class", "y axis")
				    .call(yAxis)
				    .append("text")
				    .attr("class", "axisLabel")
				    .attr("transform", "rotate(-90)")
				    .attr("y", 6)
				    .attr("dy", "-3.7em")
				    .style("text-anchor", "end")
				    .text(xyData.label.y + " (" + xyData.unit.y + ")");

				  svg.append("path")
				    .datum(data)
				    .attr("class", "line")
				    .attr("d", line);
				    */
		},

		miniGraph: function(treeData, session) {
			var that = this;
			$('.node').each( function (index) {
			    var width = 90;
			    var height = 60;
			    var id = $(this).attr("id");

				var x = d3.scale.linear()
				    .range([0, width]);

				var y = d3.scale.linear()
				    .range([height, 0]);

				var line = d3.svg.line()
				    .x(function(d) { return x(d.x); })
				    .y(function(d) { return y(d.y); });


				var obj = d3.select(this);



				var xyData = null;

				function writeXYData (data) {
					if (data != undefined && data != null) {
						xyData = data;
					}
				}

				function findDataById (tree, id) {
				
					if (tree.graphid == id) {
						writeXYData(session.getGraphData(tree.graphid).data);
					}
					else if (tree.children instanceof Array) {
					
						tree.children.forEach( function(child){
							 findDataById (child, id); 
						});
					} 
				}

				findDataById(treeData, id);

				xData = xyData.x.map(function(d){return parseFloat(d)});
				yData = xyData.y.map(function(d){return parseFloat(d)});
				
				data = [];

				for (i = 0; i < xData.length; i++) {
					var row = {
						"x": xData[i],
						"y": yData[i]
					}
					data.push (row);			
				}

				x.domain(d3.extent(xData));
				y.domain(d3.extent(yData));

			  	obj.append("path")
			      	.datum(data)
			      	.attr("class", "line")
			      	.attr("d", line)
			     	.attr("transform", function(d)
				    {
			         	return "translate(" + -42 + "," + -25 + ")";
			     	});
				      
				
			});
		}
	};

	return utility;
});
