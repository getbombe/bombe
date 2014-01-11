var LogModel = require('../models/LogModel.js');
var mongoose = require('mongoose');

// log entry
var entry = function(req, res){
	// connect to MongoDB
	if (!mongoose.connection.readyState){
    	mongoose.connect('mongodb://localhost/bombe');
	}
	var db = mongoose.connection;
	db.once('error', console.error.bind(console, 'connection error:'));

	var email = req.body.email;
	var useraction = req.body.useraction;
	var entity = req.body.entity;

	var newLog = new LogModel({
		email: email,
		useraction: useraction,
		entity: entity
	});

	newLog.save(function (err, result){
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