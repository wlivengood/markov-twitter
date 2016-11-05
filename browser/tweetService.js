app.factory('tweetService', function($http) {
	return {
		getTweetForUser: function(username) {
			return $http.get('/getTweets/' + username)
			.then(function(results) {
				return results.data;
			});
		}
	}
})