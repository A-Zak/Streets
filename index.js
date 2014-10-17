var express = require('express');
var app = express();
var mongo = require("mongodb").MongoClient;

var mdb = null;

mongo.connect('mongodb://127.0.0.1:27017/streets', function(err, db){
	if (err) throw err;
	mdb = db;
	//var collection = db.collection('stories');
	//collection.insert({"Test":true}, function(err, docs){
	//	collection.count(function(err, count){
	//		console.log("count",count);
	//	})
	//})
})

app.set('port', (process.env.PORT || 5555));

app.use('/public', express.static(__dirname + '/public'));
app.get('/', function(req, res){
	res.sendfile('./public/app.html');
});

app.get('/story', function(req,res){
	mdb.collection('stories').count(function(err, count){
		console.log("count",count);
		res.send(count);
	});
});

app.listen(app.get('port'), function() {
	console.log("running on localhost:" + app.get('port'));
});
