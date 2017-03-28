const {getRandomInt, tokenize, getStarter} = require('./tweetProcessing');

// Builds a "hash table" that maps pairs of words from tweets to the words that follow them.
// This effecively works like mapping the pairs to a probability distribution.
const hashTokens = (hash, tokens) => {
	for (let i = 0; i < tokens.length - 2; i++) {
		let pair = tokens.slice(i, i + 2);
		let next = tokens[i + 2];
		if (!hash[pair]) hash[pair] = [];
		hash[pair].push(next);
	}
}

// Given the table and a pair, return a possible next word in proportion to its probability of 
// following that pair in the text
const getNext = (hash, pair) => {
	return hash[pair] && hash[pair].length? hash[pair][getRandomInt(0, hash[pair].length - 1)]: null;
}
// Helper function to count the number of characters in an array of tokens
const countChars = (tokens) => {
	return tokens.reduce((a, b) => a + (b? b.length: 0), 0);
}

// Chop off everything occurring after an acceptable ending character (don't want to end in
// the middle of a sentence)
const strip = (tokens) => {
	const punctuation = '.!?';
	let i = tokens.length - 1;
	while (i && tokens[i] && punctuation.indexOf(tokens[i][tokens[i].length - 1]) === -1) {
		i--;
	}
	return tokens.slice(0, i + 1);
}

// Takes a starting pair and a collection of existing tweets and returns markov-chain generated
// text to populate the tweet
const createTweet = (tweets, pair) => {
	let table = {};
	let tokens = pair;
	tweets.forEach(tweet => hashTokens(table, tokenize(tweet)));
	let next = getNext(table, pair);
	tokens.push(next);
	while (countChars(tokens) < 150) {
		pair = [tokens[tokens.length-2], next];
		next = getNext(table, pair);
		if (!next) break;
		tokens.push(next);
	}
	tokens = strip(tokens);
	if (tokens.length && countChars(tokens) > 30) return tokens.join(" ");
	return createTweet(tweets, getStarter(tweets));
}

module.exports = {
	createTweet: createTweet
};
