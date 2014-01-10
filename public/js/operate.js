// $(window).resize(function() { 
// 	data = ["/uploads/data.tsv", "/uploads/data.tsv", "/uploads/data.tsv"];
// 	renderGraph(data); 
// return false;
// });
// $(document).ready( function(){ 
// 	data = ["/uploads/data.tsv", "/uploads/data.tsv", "/uploads/data.tsv"];
// 	renderGraph(data); 
// return false;
// });

$(document).ready( function(){  
 
 	if ($('#plot-before').height() != 0) {
	    window.opHeight = $('#plot-before').height();
	    window.opWidth = $('#plot-before').width();
	}
    renderGraph(treeData, window.idBefore, "#plot-before");
    renderGraph(treeData, window.idAfter, "#plot-after");

    $(window).resize(function() {
 
    	if ($('#plot-before').height() != 0) {
		    window.opHeight = $('#plot-before').height();
		    window.opWidth = $('#plot-before').width();
		}
    	renderGraph(treeData, window.idBefore, "#plot-before");
    	renderGraph(treeData, window.idAfter, "#plot-after");
        //console.log("test");
    });

    /*$("#edit-graph").click( function(){
	
    	console.log(window.idBefore);
   	 	console.log (window.idAfter);
        renderGraph(treeData, window.idBefore, "#plot-before");
    	renderGraph(treeData, window.idAfter, "#plot-after");
    

	});*/
});