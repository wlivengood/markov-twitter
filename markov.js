const getRandomInt = require('./tweetProcessing').getRandomInt;

const tokenize = tweet => tweet.split(' ');

const hashTokens = (hash, tokens) => {
	for (let i = 0; i < tokens.length - 2; i++) {
		let pair = tokens.slice(i, i + 2);
		let next = tokens[i + 2];
		if (!hash[pair]) hash[pair] = [];
		hash[pair].push(next);
	}
}

const getNext = (hash, pair) => {
	return hash[pair] && hash[pair].length? hash[pair][getRandomInt(0, hash[pair].length - 1)]: null;
}

const createChain = (tweets, n, pair) => {
	let table = {};
	let tokens = pair;
	tweets.forEach(tweet => hashTokens(table, tokenize(tweet)));
	let next = getNext(table, pair);
	tokens.push(next);
	while (n > tokens.length) {
		pair = [tokens[tokens.length-2], next];
		next = getNext(table, pair);
		if (!next) break;
		tokens.push(next);
	}
	return tokens.join(' ');
}

module.exports = {
	createChain: createChain
};




