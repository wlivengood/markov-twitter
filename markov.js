const {getRandomInt, tokenize, getStarter} = require('./tweetProcessing');

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

const countChars = (tokens) => {
	return tokens.reduce((a, b) => a + (b? b.length: 0), 0);
}

const strip = (tokens) => {
	const punctuation = '.!?';
	let i = tokens.length - 1;
	while (i && punctuation.indexOf(tokens[i][tokens[i].length - 1]) === -1) {
		i--;
	}
	return tokens.slice(0, i + 1);
}

const createTweet = (tweets, pair) => {
	let table = {};
	let tokens = pair;
	tweets.forEach(tweet => hashTokens(table, tokenize(tweet)));
	let next = getNext(table, pair);
	tokens.push(next);
	while (countChars(tokens) < 140) {
		pair = [tokens[tokens.length-2], next];
		next = getNext(table, pair);
		if (!next) break;
		tokens.push(next);
	}
	tokens = strip(tokens);
	if (tokens.length && countChars(tokens) > 30) return tokens.join(" ");
	return createTweet(tweets, getStarter(tweets));
}


// const createChain = (tweets, n, pair) => {
// 	let table = {};
// 	let tokens = pair;
// 	tweets.forEach(tweet => hashTokens(table, tokenize(tweet)));
// 	let next = getNext(table, pair);
// 	tokens.push(next);
// 	while (n > tokens.length) {
// 		pair = [tokens[tokens.length-2], next];
// 		next = getNext(table, pair);
// 		if (!next) break;
// 		tokens.push(next);
// 	}
// 	return tokens.join(" ");
// }

module.exports = {
	// createChain: createChain,
	createTweet: createTweet
};
