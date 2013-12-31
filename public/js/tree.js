function renderTree() {

	var tree = d3.layout.tree()
	    .sort(null)
	    .size([1000, 1000 - 20*10])
	    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; })
	    .children(function(d)
	    {
	        return (!d.contents || d.contents.length === 0) ? null : d.contents;
	    });

	// Setting up dummy json data
	d3.json("/uploads/tree.json", function (error, root) {

		var nodes = tree.nodes(root);
		var links = tree.links(nodes);

		/*
		     <svg>
		         <g class="container" />
		     </svg>
		  */
		 var layoutRoot = d3.select('#tree')
		     .append("svg:svg").attr("width", 1000).attr("height", 1000)
		     .append("svg:g")
		     .attr("class", "container")
		     .attr("transform", "translate(" + 80 + ",0)");


		 // Edges between nodes as a <path class="link" />
		 var link = d3.svg.diagonal()
		     .projection(function(d)
		     {
		         return [d.y, d.x];
		     });

		 layoutRoot.selectAll("path.link")
		     .data(links)
		     .enter()
		     .append("svg:path")
		     .attr("class", "link")
		     .attr("d", link);


		 /*
		     Nodes as
		     <g class="node">
		         <circle class="node-dot" />
		         <text />
		     </g>
		  */

		 var nodeGroup = layoutRoot.selectAll("g.node")
		     .data(nodes)
		     .enter()
		     .append("svg:g")
		     .attr("class", "node")
		     .attr("transform", function(d)
		     {
		         return "translate(" + d.y + "," + d.x + ")";
		     });

		 nodeGroup.append("rect")
		     .attr("class", "nodebox")
		     .attr("x", -80/2)
		     .attr("y", -60/2)
		     .attr("width", 80)
		     .attr("height", 60);

		/*nodeGroup.append("div")
			.attr("class", "miniplot")
			.attr("x", -80/2)
		    .attr("y", -60/2)
		    .attr("width", 80)
		    .attr("height", 60);*/

		renderMiniGraphs();
	});
}