function renderTree(treeData) {

	var tree = d3.layout.tree()
	    .sort(null)
	    .size([1000, 1000 - 20*10])
	    .separation(function(a, b) { return (a.parent == b.parent ? 1.5 : 2); })
	    .children(function(d)
	    {
	        return (!d.contents || d.contents.length === 0) ? null : d.contents;
	    });

	// Setting up json data
	d3.json(treeData, function (error, root) {

		var nodes = tree.nodes(root);
		var links = tree.links(nodes);

        //console.log(nodes);

		/*
		     <svg>
		         <g class="container" />
		     </svg>
		  */
		 var layoutRoot = d3.select('#treeview')
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
             //.attr("id", 'test')//nodes['id'])
		     .attr("transform", function(d)
		     {
		         return "translate(" + d.y + "," + d.x + ")";
		     });

        /*nodes.forEach( function(node){ 
            if (node['id'] == 'new') {
                node.append("circ")
                .attr("r", 10)
                .attr("class", "new-circ");
            }
        });*/

		 nodeGroup.append("rect")
		     .attr("class", "nodebox")
		     .attr("x", -150/2)
		     .attr("y", -100/2)
		     .attr("width", 150)
		     .attr("height", 100);

        data = "/uploads/data.tsv"

		renderMiniGraphs(data);
	});
}

$(window).resize(function() {
    data = ["/uploads/data.tsv", "/uploads/data.tsv", "/uploads/data.tsv"]; 
    renderGraph(data); 
    return false;
});
$(document).ready( function(){ 
    renderTree("/uploads/tree.json");
    
    data = ["/uploads/data.tsv", "/uploads/data.tsv" , "/uploads/data.tsv"];
    renderGraph(data); 
    return false;
});