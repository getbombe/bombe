function parse(dataFileName) {
	//Problem: require() statements don't work. Can't figure out why.
   	
	require(['require', 'csv', 'fs'], function(require) {

	   	var fs = require('fs');
	   	var csv = require('csv');

	   	csv()
		.from.stream(fs.createReadStream(__dirname+'/'+dataFileName))
		.to.path(__dirname+'/'+dataFileName+'.parsed')
		.transform( function(row){
		  row.unshift(row.pop());
		  return row;
		})
		.on('record', function(row,index){
		  console.log('#'+index+' '+JSON.stringify(row));
		})
		.on('end', function(count){
		  console.log('Number of lines: '+count);
		})
		.on('error', function(error){
		  console.log(error.message);
		});
	});
}