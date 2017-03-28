// Helpder function to get a random integer between min and max
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Pick a starting pair of tokens from the tweets to start the chain
const getStarter = (tweets) => {
	var starters = [];
	tweets.forEach(function(tweet) {
		starters.push(tweet.split(' ').slice(0,2));
	});
	return starters[getRandomInt(0, starters.length-1)];
};

// Create tokens from a tweet
const tokenize = (tweetText) => {
	return tweetText.split(" ");
};


module.exports = {
	getRandomInt,
	getStarter,
	tokenize
};