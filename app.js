// Create express app
const express = require('express');
const app = express();

// Modules for building markov chains and parsing tweets
const markov = require('./markov');
const tweetProcessing = require('./tweetProcessing');

// Twitter API client module
const Twit = require('twit');
const client = new Twit(require('./twitterConfig'));

// Export the app
module.exports = app;

// Body parsing middleware
app.use(require('body-parser').json());

// Logging middleware
app.use(require('morgan')('dev'));

// Serve browser files and node_modules statically
app.use(express.static(__dirname + '/browser'));
app.use(express.static(__dirname + '/node_modules'));

// Serve index file at '/'
app.get('/', function(req, res, next) {
	res.sendFile(__dirname + '/index.html');
});

/*
* API for getting a fake tweet for a user. TODO: Need to write a recursive function to repeatedly
* query the Twitter API for the next 200 tweets.
*/

let cache = {};

app.get('/getTweets/:user', function(req, res, next) {
	if (cache[req.params.user]) {
		let tweet = {};
		let cachedTweets = cache[req.params.user];
		let tweetText = cachedTweets.map(tweet => tweet.text);
		tweet.name = cachedTweets[0].user.name;
		tweet.userName = cachedTweets[0].user.screen_name;
		tweet.thumbNailSrc = cachedTweets[0].user.profile_image_url;
		tweet.text = markov.createChain(tweetText, 30, tweetProcessing.getStarter(tweetText));
		res.send(tweet);
		next();
	}
	else {
		let allTweets = [];
		let tweetText;
		let promises = [];
		let tweet = {};
		for (var i = 0; i < 16; i++) {
			promises.push(client.get('statuses/user_timeline', {
				screen_name: req.params.user,
				count: 200
			})
			.then(function(tweets) {
				allTweets = allTweets.concat(tweets.data);
			}))
		}
		Promise.all(promises)
		.then(function() {
			cache[req.params.user] = allTweets;
			tweetText = allTweets.map(tweet => tweet.text);
			tweet.name = allTweets[0].user.name;
			tweet.userName = allTweets[0].user.screen_name;
			tweet.thumbNailSrc = allTweets[0].user.profile_image_url;
			tweet.text = markov.createChain(tweetText, 30, tweetProcessing.getStarter(tweetText));
			res.send(tweet);
		});
	}
	
})

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(3000, () => {
	console.log("server listening on port 3000");
});