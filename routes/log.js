var UserModel = require('../models/UserModel.js');
var mongoose = require('mongoose');

// log entry
var entry = function(req, res){
	// connect to MongoDB
	if (!mongoose.connection.readyState){
    	mongoose.connect('mongodb://localhost/bombe');
	}
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	var email = req.body.email;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var institution = req.body.institution;
	var password = simpleauth.generateKey(req.body.password);

	var newUser = new UserModel({
		email: email,
		firstname: firstname,
		lastname: lastname,
		institution: institution,
		password: password
	});

	newUser.save(function (err, result){
		res.writeHead(200, { 'Content-Type': 'application/json' });
		
		if(err){
			console.log(err);
			res.write(JSON.stringify(
				{
					success: false
				}
			));
		} else {
			console.log(result);
			res.write(JSON.stringify(
				{
					success: true
				}
			));
		}

		res.end();
	});
};


 // export functions
 exports.entry = entry;