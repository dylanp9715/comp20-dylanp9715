// Use express
var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mongo initialization and connect to database
var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/node-js-getting-started';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

app.post("/submit", function(request, response) {
	// Enable CORS
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "X-Requested-With");

	// Retrieve data to be sent to database
	var score = request.body.score;
	var username = request.body.username;
	var grid = request.body.grid;
	var timestamp = JSON.stringify(new Date());

	// Convert string to integer
	score = parseInt(score);

	var toInsert = {
		"username": username,
		"score": score,
		"grid": grid,
		"created_at": timestamp,
	};
	
	// Insert data into database
	db.collection('leaderboard', function(error, coll) {
		coll.insert(toInsert, function(error, saved) {
			if (error) {
				response.send(500);
			}
			else {
				response.send('Thanks for your submission!');
			}
		});
	});

	
});

app.get("/scores.json", function(request, response) {
	// Retrieve username from query string
	var currUser = request.query.username;

	// Only retrieve and return JSON array of objects if user enters username in query string
	if (currUser != "" && currUser != null) {
		db.collection('leaderboard', function(err, collection) {
			collection.find({username:currUser}).sort({score:-1}).toArray(function(err, results) {
				if (!err) {
					response.send(results);
				} else {
					response.send("<!DOCTYPE HTML><html><head><title>2048 Leaderboard</title></head><body><h1>Whoops, something went terribly wrong!</h1></body></html>");
				}
			});
		});
	} else { // Otherwise, return an empty JSON array
		response.send("[]");
	}
});

app.get("/", function(request, response) {
	response.set('Content-Type', 'text/html');
	
	var indexPage = '';

	// Retrieve list of all 2048 game scores for all players
	db.collection('leaderboard', function(err, collection) {
		// Sort the scores in descending order
		collection.find().sort({score:-1}).toArray(function(err, results) {
			if (!err) {
				indexPage += "<!DOCTYPE HTML><html><head><title>2048 Leaderboard</title></head><body><h1>2048 Leaderboard</h1>";
				indexPage += "<table><tr><th>User</th><th>Score</th><th>Timestamp</th></tr>"

				// Only display the top ten scores
				var length;
				if (results.length <= 10) {
					length = results.length;
				} else {
					length = 10;
				}

				for (var count = 0; count < length; count++) {
					indexPage += "<tr><td>" + results[count].username + "</td>"
							  + "<td>" + results[count].score + "</td>"
							  +  "<td>" + results[count].created_at + "</td></tr>";
				}
				indexPage += "</body></html>"
				response.send(indexPage);
			} else {
				response.send('<!DOCTYPE HTML><html><head><title>2048 Leaderboard</title></head><body><h1>Whoops, something went terribly wrong!</h1></body></html>');
			}
		});
	});
});

app.listen(process.env.PORT || 8888);