var express = require('express');
var app = express();


app.set('port', (process.env.PORT || 5555));

app.use('/public', express.static(__dirname + '/public'));
app.get('/', function(req, res){
	res.sendfile('./public/app.html');
});

app.listen(app.get('port'), function() {
	console.log("running on localhost:" + app.get('port'));
});