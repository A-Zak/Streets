var express = require('express');
var app = express();
var mongo = require("mongodb").MongoClient;

var mdb = null;

mongo.connect('mongodb://127.0.0.1:27017/streets', function(err, db){
	if (err) throw err;
	mdb = db;
})

app.set('port', (process.env.PORT || 5555));

app.use('/public', express.static(__dirname + '/public'));
app.get('/', function(req, res){
	res.sendfile('./public/app.html');
});

app.get('/story', function(req,res){
	var col = mdb.collection('stories');
	col.count(function(err, count){
		var randNum = Math.round(Math.random() * (count - 1)) + 1;
		col.find().limit(-1).skip(randNum).nextObject(function(err,doc){
			res.send(doc);
		});
	});
});

app.get('/loadStories', function(req,res){
	var stories = require('./DBSamples/all.json');
	var col = mdb.collection('stories');
	stories.map(function(story){
		col.insert(story, function(err,col){});
	});
	res.send("loaded");
});

app.listen(app.get('port'), function() {
	console.log("running on localhost:" + app.get('port'));
});
