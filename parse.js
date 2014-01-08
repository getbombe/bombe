var fs = require('fs');
var csv = require('csv');
var dataFileName = "public/uploads/data.csv"
var delimiter = "," //e.g. can also use whitespace: " "
var csvString = "";

function isdef(ob) {
	if(typeof(ob) == "undefined") return false;
	return true;
}

function splitCSV(str, sep) {
    for (var foo = str.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
        if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
            if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
                foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
            } else if (x) {
                foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
            } else foo = foo.shift().split(sep).concat(foo);
        } else foo[x].replace(/""/g, '"');
    } return foo;
};

function csv2json (csvdata, args) {
	args = args || {};
	var delim = isdef(args.delim) ? args.delim : ",";
	// Unused
	//var textdelim = isdef(args.textdelim) ? args.textdelim : "";

	var csvlines = csvdata.split("\n");
	var csvheaders = splitCSV(csvlines[0], delim);
	var csvrows = csvlines.slice(1, csvlines.length);

	console.log(csvheaders);
	var ret = {};

	for (var h in csvheaders) {
		ret[csvheaders[h]] = [];
	}

	//ret['headers'] = csvheaders;
	//ret['rows'] = [];

	for(var r in csvrows) {
		if (csvrows.hasOwnProperty(r)) {
			var row = csvrows[r];
			var rowitems = splitCSV(row, delim);

			// Break if we're at the end of the file
			if(row.length == 0) break;

			var rowob = {};
			for(var i in rowitems) {
				if (rowitems.hasOwnProperty(i)) {
					var item = rowitems[i];

					// Try to (intelligently) cast the item to a number, if applicable
					if(!isNaN(item*1)) {
						item = item*1;
					}

					ret[csvheaders[i]].push(item);
				}
			}

			//ret.rows.push(rowob);
		}
	}

	return ret;
}

csv()
.from.stream(fs.createReadStream(__dirname+'/'+dataFileName))
//.to.path(__dirname+'/'+dataFileName+'.parsed')
.on('record', function(row,index){
	csvString += row + '\n';
	console.log('#'+index+' '+JSON.stringify(row));
})
.on('end', function(count){
	console.log('csvString: '+csvString);
	
	var output_json = csv2json(csvString, {
        delim: delimiter,
        textdelim: "\""
    });

	console.log("Converted CSV to JSON:", output_json);
})
.on('error', function(error){
	console.log(error.message);
});