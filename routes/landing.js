var fs = require('fs');

var email = function(req, res){
	var email = req.body.email;
	fs.appendFile('landingemail.txt', email + '\n', function (err) {
		console.log("New landing email: " + email);
	});
}

var print = function(req, res){
	fs.readFile('landingemail.txt', function (err, data) {
		var emails = data.toString(); 
		res.writeHead(200, { 'Content-Type': 'application/json' });

		res.write(emails);
		res.end();
	});
}

exports.email = email
exports.print = print