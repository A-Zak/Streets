var express = require('express');
var app = express();
var mongo = require("mongodb").MongoClient;
var ObjectID = require('mongodb').ObjectID;
var bodyParser = require('body-parser');
var stories = require('./DBSamples/all.json');
var gcloud = require('gcloud');
var uuid = require('node-uuid');

var bucket;
var projectId = 'kiddyup-web-001';
var bucketName = 'streets';

if(process.env.MONGO){
	bucket = gcloud.storage.bucket({
		  projectId: projectId,
	         bucketName: bucketName
	});
} else {
	bucket = gcloud.storage.bucket({
		  projectId: projectId,
	         keyFilename: __dirname + '/gcloud.json',
	         bucketName: bucketName
	});
}

bucket.write('test.txt','this is the content',function(err){
	console.log("first",err);
	bucket.createReadStream('test.txt').pipe(process.stdout, {end : false});
})

var mdb = null;

var mongoIP = process.env.MONGO ? process.env.MONGO : "127.0.0.1";

var loadStories = function () { 
    var col = mdb.collection('stories');
    stories.map(function(story){
        col.insert(story, function(err,col){});
    });
}

mongo.connect('mongodb://' + mongoIP + ':27017/streets', function(err, db){
	if (err) throw err;
	mdb = db;
})


app.set('port', (process.env.PORT || 5555));
app.use(bodyParser.json());
app.use('/public', express.static(__dirname + '/public'));
app.get('/', function(req, res){
	res.sendFile(__dirname+'/public/app.html');
});

app.get('/story/:storyId', function(req, res){
	res.sendFile(__dirname+'/public/app.html');
});



/**
 * Fetch story by ID
 */
app.get('/api/story/:storyId', function(req,res){
    var col = mdb.collection('stories');
    var storyId = req.params.storyId;
    try{
        var objectId = ObjectID.createFromHexString(storyId);
    }catch(e){
        res.send(500, 'Error : please provide a valid storyId');
        return;
    }

    console.log('Fetch story for story ID : ' + storyId);
    col.findOne(objectId, function(err, doc){
        if(err){
            console.error('Error find story by storyId : %s. Error : %s.',storyId, err);
        }else{
            res.send(doc);
        }

    });
});


app.get('/add_story', function(req,res,next) {
	res.sendFile(__dirname+'/public/add_story.html');
});


app.get('/api/story', function(req,res){
	var col = mdb.collection('stories');
	col.count(function(err, count){
		var randNum = Math.round(Math.random() * (count - 1)) + 1;
		col.find().limit(-1).skip(randNum - 1).nextObject(function(err,doc){
			res.send(doc);
		});
	});
});

app.post('/image', function(req,res){
	var newId = uuid.v4();
	var nameParts = req.files.fieldname.name.split(".");
	var extention = nameParts[nameParts.length -1];
	var filename = newId + "." + extention;
	res.send(filename);
	//bucket.createWriteStream(filename)
	//
});

var FIRST_STORY_MAGIC_ID = 'first_story';

app.get('/api/firstStory', function(req,res){
	var col = mdb.collection('stories');
	col.findOne({'_id':FIRST_STORY_MAGIC_ID}, function(err,doc) {
        if(err){
            console.error('Error find story by storyId : %s. Error : %s.',storyId, err);
        } else {
            res.send(doc);
        }
    })
});


app.post('/api/story', function(req,res){
    console.log('Adding new story');
    var col = mdb.collection('stories');
    var story = req.body;
    //TODO: add some validations!!!
    col.insert(story, function(err, records){
        if(err){
            console.error('Error adding a story. Error : ', err);
            res.send(500, 'Error adding a story.')
        }else{
            console.log('id', records[0]._id);
            res.json(records[0]);
        }

    });
});


app.get('/cleandb', function(req,res){
	mdb.collection('stories').drop();
	res.send("db clean!");
});

app.get('/loadStories', function(req,res){
	loadStories();
	res.send("loaded");
});


app.listen(app.get('port'), function() {
	console.log("running on localhost:" + app.get('port'));
});
