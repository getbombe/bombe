var TreeModel = require('../models/TreeModel.js');
var mongoose = require('mongoose');

// new tree
var init = function(req, res){
	// connect to MongoDB
	if (!mongoose.connection.readyState){
    	mongoose.connect('mongodb://localhost/bombe');
	}
	var db = mongoose.connection;
	//db.once('error', console.error.bind(console, 'connection error:'));

	var key = req.body.key;
	var name = req.body.name;
	var email = req.body.email;
	var tree = req.body.tree;

	if(key == "false"){
		// cannot find tree 
		var newTree = new TreeModel({
			name: name,
			email: email,
			tree: tree
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
						success: true,
						key: result._id
					}
				));
			}

			res.end();
		});
		return;
	}

	// replace if exist
	TreeModel.findOne({_id: key}).exec(function(err, t){
		if(err){
			console.log(err);
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify(
				{
					success: false
				}
			));
			res.end();
			return;
		}

		if(!t){
			// cannot find tree 
			var newTree = new TreeModel({
				name: name,
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
							success: true,
							key: result._id
						}
					));
				}

				res.end();
			});
		} else {
			// found a tree.. replace

			TreeModel.update({ _id: key }, { tree: tree }, function (err, numberAffected, raw) {
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
	//db.once('error', console.error.bind(console, 'connection error:'));

	var key = req.body.key;

	// replace if exist
	TreeModel.findOne({_id: key}).exec(function(err, t){
		if(err){
			console.log(err);
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify(
				{
					success: false
				}
			));
			res.end();
			return;
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

// misnomer: just the tree keys
var getAllTrees = function(req, res) {
	// connect to MongoDB
	if (!mongoose.connection.readyState){
    	mongoose.connect('mongodb://localhost/bombe');
	}
	var db = mongoose.connection;
	//db.once('error', console.error.bind(console, 'connection error:'));

	var email = req.body.email;

	TreeModel.find( {email: email} ).exec(function(err, t){
		if(err){
			console.log(err);
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify(
				{
					success: false
				}
			));
			res.end();
			return;
		}

		var keys = [];
		var names = [];

		for(var i = 0; i < t.length; i++) {
			keys.push(t[i]._id);
			names.push(t[i].name);
		}

		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.write(JSON.stringify(
			{
				success: true,
				keys: keys,
				names: names
			}
		));
		res.end();
	});	
}


var changeName = function(req, res) {
	// connect to MongoDB
	if (!mongoose.connection.readyState){
    	mongoose.connect('mongodb://localhost/bombe');
	}
	var db = mongoose.connection;
	//db.once('error', console.error.bind(console, 'connection error:'));

	var key = req.body.key;
	var name = req.body.name;
	
	TreeModel.update({ _id: key }, { name: name }, function (err, numberAffected, raw) {
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


var deleteTree = function(req, res) {
	// connect to MongoDB
	if (!mongoose.connection.readyState){
    	mongoose.connect('mongodb://localhost/bombe');
	}
	var db = mongoose.connection;
	//db.once('error', console.error.bind(console, 'connection error:'));

	var key = req.body.key;
	
	TreeModel.remove({ _id: key }, function (err) {
		if (err) return handleError(err);

		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.write(JSON.stringify(
			{
				success: true
			}
		));

		res.end();
		console.log("done delete");
	});
}

// export functions
exports.init = init;
exports.getTree = getTree;
exports.getAllTrees = getAllTrees;
exports.changeName = changeName;
exports.deleteTree = deleteTree;