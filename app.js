var express = require('express');
var app = express();
var markov = require('./markov');
var tweetProcessing = require('./tweetProcessing');
var Twit = require('twit');


var client = new Twit({
  consumer_key: 'TwxXs16xk5DCrUaOxElXz3krR',
  consumer_secret: 'xBS8caEFwVzHqs6oAqz4O7M5INQLlm4utHmzIru78u8ACbufr5',
  app_only_auth: true,
  bearer_token: 'AAAAAAAAAAAAAAAAAAAAAPlIxwAAAAAA07IY8szCA4C%2FmXNFrimF36yZDlQ%3D4Sf574hpWLkj6c3uWlZM49nhWZTdlw06eYIMz6Rv9vSNLLrUEy'
});

module.exports = app;

app.use(require('body-parser').json());
app.use(require('morgan')('dev'));

app.use(express.static(__dirname + '/browser'));
app.use(express.static(__dirname + '/node_modules'));

app.get('/', function(req, res, next) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/getTweets/:user', function(req, res, next) {
	var userName;
	var name;
	var thumbNailSrc;
	var date = new Date();
	var allTweets = [];
	var tweetText;
	var promises = [];
	var tweet = {};
	for (var i = 0; i < 16; i++) {
		promises.push(client.get('statuses/user_timeline.json?screen_name=' + req.params.user + "&count=200")
			.then(function(tweets) {
				allTweets = allTweets.concat(tweets.data);
			}))
	}
	Promise.all(promises)
	.then(function() {
		console.log(allTweets[0]);
		name = allTweets[0].user.name;
		userName = allTweets[0].user.screen_name;
		thumbNailSrc = allTweets[0].user.profile_image_url;
		tweetText = allTweets.map(function(tweet) {
			return tweet.text;
		});
		tweet.text = markov.createChain(tweetText, 30, tweetProcessing.getStarter(tweetText));
		tweet.name = name;
		tweet.userName = userName;
		tweet.thumbNailSrc = thumbNailSrc;
		res.send(tweet);
	});
	
})

app.use(function (err, req, res, next) {
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(3000, function() {
	console.log("server listening on port 3000");
});