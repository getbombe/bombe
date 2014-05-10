
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');

var user = require('./routes/user');
var upload = require('./routes/upload');
var log = require('./routes/log');
var tree = require('./routes/tree');
var landing = require('./routes/landing');
var data = require('./routes/graphData');

var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(app.router);
app.use('/enigma', express.static(path.join(__dirname, 'enigmapublic')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


// ROUTES
// point to public
app.use('/', express.static(path.join(__dirname, '../public')));

// GET routes

// POST routes
app.post('/register', user.register);
app.post('/login', user.login);
app.post('/upload', upload.upload);

app.post('/newtree', tree.init);
app.post('/tree/get', tree.getTree);
app.post('/tree/changename', tree.changeName);
app.post('/tree/deletetree', tree.deleteTree);

app.post('/getalltrees', tree.getAllTrees);

app.post('/landingpageemail', landing.email);
app.get('/landingemail-bombebombe1337!!!w3s0k00l', landing.print);

app.post('/data/load', data.load);
app.post('/data/save', data.save);
app.post('/data/change', data.change);

app.post('/log', log.entry);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
