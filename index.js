var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/streets.png');
});

app.listen(3000);
console.log("listening on 3000");