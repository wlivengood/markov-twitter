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


// const hashTokens = (hash, tokens) => {
// 	for (let i =0; i < tokens.length-2; i++) {
// 		let pair = [tokens[i], tokens[i+1]];
// 		let next = tokens[i+2];
// 		if (hash[pair]) {
// 			hash[pair][next] = hash[pair][next]? hash[pair][next]+1: 1;
// 			hash[pair].total++;
// 		}
// 		else {
// 			hash[pair] = {};
// 			hash[pair][next] = 1;
// 			hash[pair].total = 1;
// 		}
// 	}
// }

// const getNext = (hash, pair) => {
// 	if (hash[pair]) {
// 		while(1) {
// 			for (next in hash[pair]) {
// 				if (next === 'total')
// 					continue;
// 				var total = hash[pair].total;
// 				randInt = getRandomInt(0, total);
// 				if (hash[pair][next] >= randInt)
// 					return next;
// 			}
// 		}
// 	}
// 	else return null;
// }

// function getStarters(tweets) {
// 	var starters = [];
// 	tweets.forEach(tweet) {

// 	}
// }

const createChain = (tweets, n, pair) => {
	console.log("in createChain");
	let table = {};
	let tokens = pair;
	tweets.forEach(tweet => hashTokens(table, tokenize(tweet)));
	let next = getNext(table, pair);
	tokens.push(next);
	while (n > tokens.length) {
		pair = [tokens[tokens.length-2], next];
		console.log("pair was ", pair);
		console.log("table entry is ", table[pair]);
		console.log("next was ", next);
		next = getNext(table, pair);
		console.log("next is ", next);
		if (!next) break;
		tokens.push(next);
	}
	console.log(tokens);
	return tokens.join(' ');
}

module.exports = {
	createChain: createChain
};




