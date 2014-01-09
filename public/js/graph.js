function renderGraph(data) {
	
	$('.plot').each( function(index) {
	    if ($(this).parent().parent().parent().parent().css('display') != 'none') {
	    	//console.log($(this).parent().parent().parent().parent().css('display'));
			$(this).html('');

			var margin = {top: 20, right: 20, bottom: 40, left: 50};
		    var width = $(this).width() - margin.left - margin.right;
		    var height = $(this).height() - margin.top - margin.bottom;

			var parseDate = d3.time.format("%d-%b-%y").parse;

			var x = d3.time.scale()
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
			    .x(function(d) { return x(d.date); })
			    .y(function(d) { return y(d.close); });

			 var svg = d3.select(this).append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			//console.log("index: " + index);
			d3.tsv(data[index], function(error, data) {
			    
			  data.forEach(function(d) {
			    d.date = parseDate(d.date);
			    d.close = +d.close;
			  });


			  x.domain(d3.extent(data, function(d) { return d.date; }));
			  y.domain(d3.extent(data, function(d) { return d.close; }));

			
			  svg.append("g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + height + ")")
			      .call(xAxis)
			     .append("text")
			      .attr("x", width)
			      .attr("dy", "2.7em")
			      .style("text-anchor", "end")
			      .text("X-Data (Units)");

			  svg.append("g")
			      .attr("class", "y axis")
			      .call(yAxis)
			    .append("text")
			      .attr("transform", "rotate(-90)")
			      .attr("y", 6)
			      .attr("dy", "-3em")
			      .style("text-anchor", "end")
			      .text("Y-Data (Units)");

			  svg.append("path")
			      .datum(data)
			      .attr("class", "line")
			      .attr("d", line);
			});
		};
	});	
}

function miniGraph(treeData) {

	$('.node').each( function (index) {
	    var width = 130;
	    var height = 90;
	    var id = $(this).attr("id");
	    console.log(id);

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
		
			console.log(tree);
			if (tree.data.graphid == id) {
				console.log("Returned: " + tree.data.data);
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

		console.log(xData);
		console.log(yData);
		
		data = [];

		for (i = 0; i < xData.length; i++) {
			var row = {
				"x": xData[i],
				"y": yData[i]
			}
			data.push (row);			
		}

		console.log(data);
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
