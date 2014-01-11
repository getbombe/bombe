var UserModel = require('../models/UserModel.js');
var mongoose = require('mongoose');
var simpleauth = require('simpleauth');

// user registration
var register = function(req, res){
	// connect to MongoDB
	if (!mongoose.connection.readyState){
    	mongoose.connect('mongodb://localhost/bombe');
	}
	var db = mongoose.connection;
	//db.once('error', console.error.bind(console, 'connection error:'));

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


// user login
var login = function(req, res){
	// connect to MongoDB
	if (!mongoose.connection.readyState){
    	mongoose.connect('mongodb://localhost/bombe');
	}
	var db = mongoose.connection;
	//db.once('error', console.error.bind(console, 'connection error:'));

	var email = req.body.email;
	var password = simpleauth.generateKey(req.body.password);

	UserModel.findOne({email: email}).exec(function(err, user){
		res.writeHead(200, { 'Content-Type': 'application/json' });

		if(err){
			// nothing. it shouldn't happen
			// TODO: make something happen in case of DB error
		}

		if(!user){
			// cannot find user (user == null)
			res.write(JSON.stringify(
				{
					success: false,
					error: "User not found!"
				}
			));
		} else {
			// found a user... check for password
			if(password == user.password){
				// correct password
				res.write(JSON.stringify(
					{
						success: true,
						// give back auth string
						key: simpleauth.generateKey(email)
					}
				));
			} else {
				// wrong password
				res.write(JSON.stringify(
					{
						success: false,
						error: "Incorrect password!"
					}
				));
			}
		}
		res.end();
	});
};

 // export functions
 exports.register = register;
 exports.login = login;