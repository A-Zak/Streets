var express = require('express');
var app = express();
var mongo = require("mongodb").MongoClient;
var ObjectID = require('mongodb').ObjectID;
var bodyParser = require('body-parser');
var stories = require('./DBSamples/all.json');
var fs = require('fs');
var mdb = null;
var FACEBOOK_APP_ID = '543308622468738';

var mongoIP = process.env.MONGO ? process.env.MONGO : "127.0.0.1";
var gcloud = require('gcloud');
var uuid = require('node-uuid');
var busboy = require('connect-busboy');

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

var mdb = null;

function generateOpenGraphTags(story) {
    var opengraph =
        '<meta name="og:title" content="A story at ' + story.location + ' by ' + story.authorName + '">'+
        '<meta name="og:site_name" content="Streets.City">'+
        //'<meta name="og:description" content="A short story taking place in ' + story.location + ' by ' + story.authorName + ' written on ' + story.storyCreateDate +'">'+
        '<meta name="og:description" content="' + story.text.replace('"','&quot;') + '">'+
        '<meta name="og:image" content="'+story.imageUrl+'">'+
        '<meta name="fb:app_id" content="'+FACEBOOK_APP_ID+'">';

    return opengraph;
}

function renderAppHtml(opengraphTags, callback) {
    fs.readFile(__dirname+'/public/app.html', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      data = data.replace('OPENGRAPH_TAGS_THIS_IS_REPLACED_DONT_CHANGE_IT_RANDOM_ID_FOLLOWS_AGAGAOEGASJDGAEGOEGOR',opengraphTags);

      callback(data);
    });
}

var OPENGRAPH_TAGS_MAIN_PAGE =
    '<meta name="og:title" content="Streets.City - Welcome">'+
    '<meta name="og:site_name" content="Streets.City">'+
    '<meta name="og:description" content="I AM A DESCRIPTION - CHANGE MEEEEEE">'+
    //'<meta name="og:image" content="I AM AN IMAGE - CHANGE MEEEEEE">'+
    '<meta name="fb:app_id" content="'+FACEBOOK_APP_ID+'">';

app.set('port', (process.env.PORT || 5555));
app.use(bodyParser.json());
app.use(busboy());
app.use('/public', express.static(__dirname + '/public'));
app.get('/', function(req, res){
    var openGraphTags = OPENGRAPH_TAGS_MAIN_PAGE;

    renderAppHtml(openGraphTags, function(page) {
        res.send(200, page);
    });
});

app.get('/about', function(req, res){
    renderAppHtml('', function(page) {
        res.send(200, page);
    });
});

app.get('/story/:storyId', function(req, res){
    // Get the story, create opengraph tags, set template and return

    var col = mdb.collection('stories');
    var storyId = req.params.storyId;

    try {
        var objectId = ObjectID.createFromHexString(storyId);
    } catch(e){
        res.send(500, 'Error : please provide a valid storyId');
        return;
    }

	col.findOne(objectId, function(err, doc){
        if(err){
            console.error('Error find story by storyId : %s. Error : %s.',storyId, err);
        } else {

            var openGraphTags = generateOpenGraphTags(doc);
            renderAppHtml(openGraphTags, function(page) {
                res.send(200, page);
            });
        }

    });
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

app.get('/terms', function(req,res,next) {
    res.sendFile(__dirname+'/public/terms.html');
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

app.get('/image/:filename', function(req,res){
	bucket.createReadStream(req.params.filename).pipe(res);
});

app.post('/image', function(req,res){
	req.pipe(req.busboy);
	req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype){
		var newId = uuid.v4();
		var filename = "/image/" + newId + "." + mimetype.split("/")[1];
		file.pipe(bucket.createWriteStream(filename))
			.on('complete', function(){
				res.send(filename);
			})
			.on('error', function(e){
				console.log("error",e);
				res.send(401, e);
			});
	});
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


var loadStories = function () { 
    var col = mdb.collection('stories');
    stories.map(function(story){
        col.insert(story, function(err,col){});
    });
}


app.get('/loadStories', function(req,res){
	loadStories();
	res.send("loaded");
});








// production external ip: 107.167.178.229
var mongoIP = process.env.MONGO ? process.env.MONGO : "127.0.0.1";

console.log("connecting to mongo:" + 'mongodb://' + mongoIP + ':27017/streets');



mongo.connect('mongodb://' + mongoIP + ':27017/streets', function(err, db){
    
    if (err) throw err;

    
    console.log("mongo connected!");
    mdb = db;

    app.listen(app.get('port'), function() {
        console.log("running on localhost:" + app.get('port'));
    });
})













