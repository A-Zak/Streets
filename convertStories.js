#!/usr/bin/env node

var fs = require('fs');
var csv = require('csv');




var storiesCSV = fs.readFileSync(__dirname + "/new_stories.csv");

csv.parse(storiesCSV, {}, function(error, storiesArray) {

	storiesArray.shift();
	storiesArray = storiesArray.map(function(storyRow) {

    var story = {
      storyCreateDate: storyRow[0],
      location: storyRow[1],
      storyDate: storyRow[2],
      text: storyRow[3],
      imageUrl: storyRow[4],
      tags: [],
      email: "",
      authorName: storyRow[5]
    };

		return story;
	});

	console.log(JSON.stringify(storiesArray, undefined, 4));
});

