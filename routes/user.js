var UserModel = require('../models/UserModel.js');
var mongoose = require('mongoose');
var simpleauth = require('simpleauth');

/*
 * GET users listing.
 */

var list = function(req, res){
  res.send("respond with a resource");
};


/*
 * POST user registration
 */
var register = function(req, res){
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
			res.write("error");
		} else {
			res.write("success");
		}

		res.end();
	});
}


 // export functions
 exports.list = list;
 exports.register = register;