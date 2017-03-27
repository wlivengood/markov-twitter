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
* API for getting a fake tweet from a user. Because the Twitter API only serves tweets from
* a timeline 200 at a time, we have to recursively call the API, passing in a the oldest
* tweet each time to get the next oldest batch of 200 tweets. After this is done once for
* a given username, the results are cached. TODO: Implement an LRU cache for the cache.
*/

let cache = {};

app.get('/getTweets/:user', (req, res, next) => {

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
		let opts = {
			screen_name: req.params.user,
			count: 200,
			include_rts: false,
			exclude_replies: true,
		}

		let allTweets = []

		function getNext(max=null) {
			return new Promise((resolve, reject) => {
				if (max) opts.max_id = max;
				client.get('statuses/user_timeline', opts)
				.then(function(response) {
					if (response.data.length > 2) {
						allTweets = allTweets.concat(response.data);
						getNext(response.data[response.data.length - 1].id_str)
						.then(() => resolve());
					}
					else {
						resolve();
					}
				})
			});
		}
		getNext()
		.then(() => {
			cache[req.params.user] = allTweets;
			let tweet = {};
			tweetText = allTweets.map(tweet => tweet.text);
			tweet.name = allTweets[0].user.name;
			tweet.userName = allTweets[0].user.screen_name;
			tweet.thumbNailSrc = allTweets[0].user.profile_image_url;
			tweet.text = markov.createTweet(tweetText, tweetProcessing.getStarter(tweetText));
			res.send(tweet);
		})
		.catch((e) => res.send(e));
	}
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(process.env.PORT || 3000, () => {
	console.log("server listening");
});