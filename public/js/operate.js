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
    treeData = $.getJSON("/uploads/tree.json", function (d) {
        //console.log(d);
        renderTree(d);
        renderGraph(d, 0000);

        $(window).resize(function() {
            renderGraph(d, 0000); 
            //console.log("test");
        });

        $(".node").click( function(){
            console.log($(this).attr("id"));
            renderGraph(d, $(this).attr("id"));
        });
    });
});