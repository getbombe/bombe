function renderTree(treeData) {

	var tree = d3.layout.tree()
	    .sort(null)
	    .size([1000, 1000 - 20*10])
	    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; })
	    .children(function(d)
	    {
	        return (!d.contents || d.contents.length === 0) ? null : d.contents;
	    });

	// Setting up dummy json data
	d3.json(treeData, function (error, root) {

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

//TODO: Make pan/zoom actually work. See http://bl.ocks.org/robschmuecker/7880033

function pan(domNode, direction) {
    var speed = panSpeed;
    if (panTimer) {
        clearTimeout(panTimer);
        translateCoords = d3.transform(svgGroup.attr("transform"));
        if (direction == 'left' || direction == 'right') {
            translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
            translateY = translateCoords.translate[1];
        } else if (direction == 'up' || direction == 'down') {
            translateX = translateCoords.translate[0];
            translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
        }
        scaleX = translateCoords.scale[0];
        scaleY = translateCoords.scale[1];
        scale = zoomListener.scale();
        svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
        d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
        zoomListener.scale(zoomListener.scale());
        zoomListener.translate([translateX, translateY]);
        panTimer = setTimeout(function() {
            pan(domNode, speed, direction);
        }, 50);
    }
}

function zoom() {
        svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }


    // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);


dragListener = d3.behavior.drag()
    .on("dragstart", function(d) {
        if (d == root) {
            return;
        }
        dragStarted = true;
        nodes = tree.nodes(d);
        d3.event.sourceEvent.stopPropagation();
        // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
    })
    .on("drag", function(d) {
        if (d == root) {
            return;
        }
        if (dragStarted) {
            domNode = this;
            initiateDrag(d, domNode);
        }

        // get coords of mouseEvent relative to svg container to allow for panning
        relCoords = d3.mouse($('svg').get(0));
        if (relCoords[0] < panBoundary) {
            panTimer = true;
            pan(this, 'left');
        } else if (relCoords[0] > ($('svg').width() - panBoundary)) {

            panTimer = true;
            pan(this, 'right');
        } else if (relCoords[1] < panBoundary) {
            panTimer = true;
            pan(this, 'up');
        } else if (relCoords[1] > ($('svg').height() - panBoundary)) {
            panTimer = true;
            pan(this, 'down');
        } else {
            try {
                clearTimeout(panTimer);
            } catch (e) {

            }
        }

        d.x0 += d3.event.dy;
        d.y0 += d3.event.dx;
        var node = d3.select(this);
        node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
        updateTempConnector();
    });