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
	var title = req.body.data.title;

	var dataX = req.body.data.data.x;
	var dataY = req.body.data.data.y;

	var unitX = req.body.data.unit.x;
	var unitY = req.body.data.unit.y;

	var labelX = req.body.data.label.x;
	var labelY = req.body.data.label.y;

	var newGraphData = new GraphDataModel({
		email: email,
		
		title: title,

		dataX: dataX,
		dataY: dataY,

		unitX: unitX,
		unitY: unitY,

		labelX: labelX,
		labelY: labelY
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
	GraphDataModel.findOne({_id: key}).exec(function(err, t){
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
			var returnData = {
				title: t.title,
				data: {
					x: t.dataX,
					y: t.dataY
				},
				unit: {
					x: t.unitX,
					y: t.unitY
				},
				label: {
					x: t.labelX,
					y: t.labelY
				}
			};

			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify(
				{
					success: true,
					graphData: returnData
				}
			));

			res.end();
		}
	});
};
// change data
var change = function(req, res){
	// connect to MongoDB
	if (!mongoose.connection.readyState){
    	mongoose.connect('mongodb://localhost/bombe');
	}
	var db = mongoose.connection;
	//db.once('error', console.error.bind(console, 'connection error:'));

	var id = req.body.key;

	var update = {
		title: req.body.data.title,

		dataX: req.body.data.data.x,
		dataY: req.body.data.data.y,

		unitX: req.body.data.unit.x,
		unitY: req.body.data.unit.y,

		labelX: req.body.data.label.x,
		labelY: req.body.data.label.y
	}

	GraphDataModel.update({ _id: id }, update, function (err, numberAffected, raw) {
		if (err) return handleError(err);
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.write(JSON.stringify(
			{
				success: true
			}
		));

		res.end();
	});
};

 // export functions
 exports.save = save;
 exports.load = load;
 exports.change = change;