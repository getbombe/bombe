var fs = require('fs');
var csv = require('csv');

var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');

var dataFileName = "public/uploads/data.tsv"
var delimiter = "," //e.g. can also use whitespace: " "
var csvString = "";

var fs = require("fs");

var upload = function(req, res){
	console.log(req.body);
	fs.readFile(req.files.uploadedfile.path, function (err, data) {
		var email = req.body.email;

		var newPath = __dirname + "/../uploadedfiles/" + email + Date.now();
		console.log(newPath);

		fs.writeFile(newPath, data, function (err) {
			console.log(err);
		});

		var strData = decoder.write(data);

		var output_json = csv2json(strData, {
	        delim: delimiter,
	        textdelim: "\""
	    });

	    console.log(output_json);

	    res.writeHead(200, { 'Content-Type': 'application/json' });
		
		res.write(JSON.stringify(
			{
				tree: output_json
			}
		));

		res.end();
	});
};



// parser
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
	var csvheaders = ["x", "y"];
	var csvlabels = splitCSV(csvlines[0], delim);
	var csvrows = csvlines.slice(1, csvlines.length);

	//console.log(csvheaders);
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
			for(var i = 0 ; i < 2; i ++) { // only x y
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


exports.upload = upload;