var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res){
	console.log("sending streets image");
  res.sendFile(__dirname + '/streets.png');
});

app.listen(app.get('port'), function() {
  console.log("running at localhost:" + app.get('port'));
});