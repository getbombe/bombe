var fs = require("fs");

var upload = function(req, res){
	fs.readFile(req.files.uploadedfile.path, function (err, data) {
	// ...
		var newPath = __dirname + "/../uploadedfiles/uploadedFileName";
		console.log(newPath);
		fs.writeFile(newPath, data, function (err) {
			console.log(err);
		});
	});
};

exports.upload = upload;