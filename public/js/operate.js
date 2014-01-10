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
    
    //console.log(d);
    renderGraph(treeData, 0, "#plot-before");
    renderGraph(treeData, 2, "#plot-after");

    $(window).resize(function() {
        renderGraph(treeData, 0, "#plot-before");
    	renderGraph(treeData, 2, "#plot-after");
        //console.log("test");
    });
});