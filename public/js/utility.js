/*
 * Bombe utility library
 */

define([
	'jquery',
	'underscore',
	'backbone',
], function($, _, Backbone) {
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
				data: JSON.stringify(data)
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
			if (tree.data.graphid == id && id != null && id != undefined) {
				session.activeNode = tree;
			}
			else if (tree.children instanceof Array) {
				tree.children.forEach( function(child){
				  activateNodeById(child, id); 
				});
			} 
		},

		renderGraph: function(treeData, id, viewid) {
	
	
		    //if ($(viewid).parent().parent().parent().parent().css('display') != 'none' && viewid == "#plot-preview") {
		    	//console.log($(this).parent().parent().parent().parent().css('display'));
				$(viewid).html('');

				var titleid = viewid + "-titlebar";

				//console.log (titleid + " .graphid");
				$(titleid + " .graphid").html(id);

				var margin = {top: 20, right: 20, bottom: 40, left: 50};
			    var width = $(viewid).width() - margin.left - margin.right;
			    var height = $(viewid).height() - margin.top - margin.bottom;

			 //    if ((viewid == "#plot-before" || viewid == "#plot-after") && window.opHeight != undefined && window.opWidth != undefined) {
			 //    	//console.log (window.opHeight);
				// 	width = window.opWidth - margin.left - margin.right;
			 //    	height = window.opHeight - margin.top - margin.bottom;
				// }	

				// if (viewid == "#plot-preview" && window.preHeight != undefined && window.preWidth != undefined) {
				// 	width = window.preWidth - margin.left - margin.right;
			 //    	height = window.preHeight - margin.top - margin.bottom;
				// }

				//var parseDate = d3.time.format("%d-%b-%y").parse;

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

				var xyData = null;

				function writeXYData (data) {
					if (data != undefined && data != null) {
						xyData = data;
					}
				}

				if (id == "new") {
					return;
				}

				function findDataById (tree, id) {
				
					//console.log(tree);
					if (tree.data.graphid == id) {
						//console.log("Returned: " + tree.data.data);
						writeXYData(tree.data);
					}
					else if (tree.children instanceof Array) {
						//console.log(tree.children);
						tree.children.forEach( function(child){
							 findDataById (child, id); 
						});
					} 
				}

				findDataById(treeData, id);

				
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
				    .attr("x", width)
				    .attr("dy", "2.7em")
				    //.attr("class", "edit")
				    .style("text-anchor", "end")
				    .text(xyData.label.x + " (" + xyData.unit.x + ")");

				  svg.append("g")
				    .attr("class", "y axis")
				    .call(yAxis)
				    .append("text")
				    .attr("transform", "rotate(-90)")
				    .attr("y", 6)
				    //.attr("class", "edit")
				    .attr("dy", "-3em")
				    .style("text-anchor", "end")
				    .text(xyData.label.y + " (" + xyData.unit.y + ")");

				  svg.append("path")
				    .datum(data)
				    .attr("class", "line")
				    .attr("d", line);
				
			//}
		},

		miniGraph: function(treeData) {

			$('.node').each( function (index) {
			    var width = 130;
			    var height = 90;
			    var id = $(this).attr("id");
			    //console.log(id);

				//var parseDate = d3.time.format("%d-%b-%y").parse;

				var x = d3.scale.linear()
				    .range([0, width]);

				var y = d3.scale.linear()
				    .range([height, 0]);

				var line = d3.svg.line()
				    .x(function(d) { return x(d.x); })
				    .y(function(d) { return y(d.y); });

				 /*var svg = d3.select(this).append("svg")
				    .attr("width", width + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom)
				    .attr("x", xpos)
				    .attr("y", ypos)
				    .append("g")
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");*/

				var obj = d3.select(this);

				 /*obj.append("rect")
				     .attr("class", "nodebox")
				     .attr("width", 100)
				     .attr("height", 160)
				     .attr("x", -80/2)
				     .attr("y", -60/2);*/

				var xyData = null;

				function writeXYData (data) {
					if (data != undefined && data != null) {
						xyData = data;
					}
				}

				function findDataById (tree, id) {
				
					//console.log(tree);
					if (tree.data.graphid == id) {
						//console.log("Returned: " + tree.data.data);
						writeXYData(tree.data.data);
					}
					else if (tree.children instanceof Array) {
						//console.log(tree.children);
						tree.children.forEach( function(child){
							 findDataById (child, id); 
						});
					} 
				}

				findDataById(treeData, id);

				xData = xyData.x.map(function(d){return parseFloat(d)});
				yData = xyData.y.map(function(d){return parseFloat(d)});

				//console.log(xData);
				//console.log(yData);
				
				data = [];

				for (i = 0; i < xData.length; i++) {
					var row = {
						"x": xData[i],
						"y": yData[i]
					}
					data.push (row);			
				}

				//console.log(data);
				//console.log(treeData['data'].graphid);
				
				x.domain(d3.extent(xData));
				y.domain(d3.extent(yData));

				//console.log(d3.extent(xData));
				//console.log(d3.extent(yData));

			  	obj.append("path")
			      	.datum(data)
			      	.attr("class", "line")
			      	.attr("d", line)
			     	.attr("transform", function(d)
				    {
			         	return "translate(" + -65 + "," + -45 + ")";
			     	});
				      
				
			});
		}

	};

	return utility;
});
