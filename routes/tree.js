var TreeModel = require('../models/TreeModel.js');
var mongoose = require('mongoose');

// new tree
var init = function(req, res){
	// connect to MongoDB
	if (!mongoose.connection.readyState){
    	mongoose.connect('mongodb://localhost/bombe');
	}
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	var email = req.body.email;
	var tree = req.body.tree;

	// replace if exist
	TreeModel.findOne({email: email}).exec(function(err, t){
		if(err){
			// nothing. it shouldn't happen
			// TODO: make something happen in case of DB error
		}

		if(!t){
			// cannot find tree 
			var newTree = new TreeModel({
				email: email,
				tree: tree,
			});
			newTree.save(function (err, result){
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
		} else {
			// found a tree.. replace

			TreeModel.update({ email: email }, { tree: tree }, function (err, numberAffected, raw) {
				if (err) return handleError(err);
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(
					{
						success: true
					}
				));

				res.end();
			});

		}
	});
};

var getTree = function(req, res){
	// connect to MongoDB
	if (!mongoose.connection.readyState){
    	mongoose.connect('mongodb://localhost/bombe');
	}
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	var email = req.body.email;

	// replace if exist
	TreeModel.findOne({email: email}).exec(function(err, t){
		if(err){
			// nothing. it shouldn't happen
			// TODO: make something happen in case of DB error
		}

		if(!t){
			// no tree found
			res.writeHead(200, { 'Content-Type': 'application/json' });

			res.write(JSON.stringify(
				{
					success: false
				}
			));
			res.end();
		} else {
			// found a tree.. return
			console.log(t);
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify(
				{
					success: true,
					tree: t.tree
				}
			));

			res.end();
		}
	});
};

 // export functions
 exports.init = init;
 exports.getTree = getTree;