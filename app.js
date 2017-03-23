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
app.use('/vendor', express.static(__dirname + '/node_modules'));

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
		// tweet.text = markov.createChain(tweetText, 30, tweetProcessing.getStarter(tweetText));
		tweet.text = markov.createTweet(tweetText, tweetProcessing.getStarter(tweetText));
		res.send(tweet);
		next();
	}
	else {
		let allTweets = [];
		let tweet = {};

		const getNext = function(response) {
			allTweets = allTweets.concat(response.data);
			if (response.data.length < 2) return Promise.resolve({data: []});
			let max = response.data[response.data.length - 1].id_str;
			return client.get('statuses/user_timeline', {
				screen_name: req.params.user,
				count: 200,
				include_rts: false,
				exclude_replies: true,
				max_id: max
			});
		}

		client.get('statuses/user_timeline', {
			screen_name: req.params.user,
			count: 200,
			include_rts: false,
			exclude_replies: true,
		})
		.then(getNext)
		.then(getNext)
		.then(getNext)
		.then(getNext)
		.then(getNext)
		.then(getNext)
		.then(getNext)
		.then(getNext)
		.then(getNext)
		.then(getNext)
		.then(getNext)
		.then(getNext)
		.then(getNext)
		.then(function(response) {
			allTweets = allTweets.concat(response.data);
			console.log(allTweets.length);
			cache[req.params.user] = allTweets;
			tweetText = allTweets.map(tweet => tweet.text);
			tweet.name = allTweets[0].user.name;
			tweet.userName = allTweets[0].user.screen_name;
			tweet.thumbNailSrc = allTweets[0].user.profile_image_url;
			// tweet.text = markov.createChain(tweetText, 30, tweetProcessing.getStarter(tweetText));
			tweet.text = markov.createTweet(tweetText, tweetProcessing.getStarter(tweetText));
			res.send(tweet);
		})
		.catch((e) => res.send(e))
	}
	
})

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(process.env.PORT || 3000, () => {
	console.log("server listening");
});