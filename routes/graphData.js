var GraphDataModel = require('../models/GraphDataModel.js');
var mongoose = require('mongoose');

// save data
var save = function(req, res){
	// connect to MongoDB
	if (!mongoose.connection.readyState){
    	mongoose.connect('mongodb://localhost/bombe');
	}
	var db = mongoose.connection;
	//db.once('error', console.error.bind(console, 'connection error:'));

	var email = req.body.email;
	var data = req.body.data;

	var newGraphData = new GraphDataModel({
		email: email,
		graphData: data,
	});
	newGraphData.save(function (err, result){
		res.writeHead(200, { 'Content-Type': 'application/json' });
		
		if(err){
			console.log(err);
			res.write(JSON.stringify(
				{
					success: false,
					key: -1
				}
			));
		} else {
			console.log(result);
			res.write(JSON.stringify(
				{
					success: true,
					key: result._id
				}
			));
		}

		res.end();
	});
};

// load data
var load = function(req, res){
	// connect to MongoDB
	if (!mongoose.connection.readyState){
    	mongoose.connect('mongodb://localhost/bombe');
	}
	var db = mongoose.connection;
	//db.once('error', console.error.bind(console, 'connection error:'));

	var email = req.body.email;
	var key = req.body.key;

	// replace if exist
	GraphDataModel.findOne({_id: id}).exec(function(err, t){
		if(err){
			// nothing. it shouldn't happen
			// TODO: make something happen in case of DB error
		}

		if(!t){
			// no data found
			res.writeHead(200, { 'Content-Type': 'application/json' });

			res.write(JSON.stringify(
				{
					success: false
				}
			));
			res.end();
		} else {
			// found data.. return
			console.log(t);
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify(
				{
					success: true,
					graphData: t.graphData
				}
			));

			res.end();
		}
	});
};

 // export functions
 exports.save = save;
 exports.load = load;