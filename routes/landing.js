var fs = require('fs');

var email = function(req, res){
	var email = req.body.email;
	fs.appendFile('landingemail.txt', email + '\n', function (err) {
		console.log("New landing email: " + email);
	});
}

exports.email = email