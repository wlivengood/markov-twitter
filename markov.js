var tweetTokenizer = require('talisman/tokenizers/tweets/casual').default;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function tokenize(tweet) {
	return tweet.split(' ');
	// return tweetTokenizer(tweet);
}

function hashTokens(hash, tokens) {
	for (var i =0; i < tokens.length-2; i++) {
		var pair = [tokens[i], tokens[i+1]];
		var next = tokens[i+2];
		if (hash[pair]) {
			hash[pair][next] = hash[pair][next]? hash[pair][next]+1: 1;
			hash[pair].total++;
		}
		else {
			hash[pair] = {};
			hash[pair][next] = 1;
			hash[pair].total = 1;
		}
	}
}

function getNext(hash, pair) {
	if (hash[pair]) {
		while(1) {
			for (next in hash[pair]) {
				if (next === 'total')
					continue;
				var total = hash[pair].total;
				randInt = getRandomInt(0, total);
				if (hash[pair][next] >= randInt)
					return next;
			}
		}
	}
	else return null;
}

// function getStarters(tweets) {
// 	var starters = [];
// 	tweets.forEach(tweet) {

// 	}
// }

function createChain(tweets, n, pair) {
	var table = {};
	var tokens = pair;
	tweets.forEach(function(tweet) {
		hashTokens(table, tokenize(tweet));
	});
	while (n > tokens.length) {
		var next = getNext(table, pair);
		tokens.push(next);
		pair = [tokens[tokens.length-2], next];
	}
	return tokens.join(' ');
}

module.exports = {
	createChain: createChain
};




