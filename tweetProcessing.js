function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getStarter(tweets) {
	var starters = [];
	tweets.forEach(function(tweet) {
		starters.push(tweet.split(' ').slice(0,2));
		// starters.push(tweet.split('. ').slice(1).split(' ').slice(0,2));
		// starters.push(tweet.split('? ').slice(1).split(' ').slice(0,2));
		// starters.push(tweet.split('! ').slice(1).split(' ').slice(0,2));
	});
	return starters[getRandomInt(0, starters.length-1)];
}

function replaceArtifacts(tweet) {
	var mentionPattern = /\B@[a-z0-9_-]+/gi;
	var urlPattern = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
	return tweet.replace(mentionPattern, "@some_person ").replace(urlPattern, " some-link.com ");
}

module.exports = {
	getStarter: getStarter,
	replaceArtifacts: replaceArtifacts
};