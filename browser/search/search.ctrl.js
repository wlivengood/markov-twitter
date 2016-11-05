app.controller("searchCtrl", function($scope, tweetService) {
	$scope.tweet = {};
	function getTweet() {
		console.log("in get tweet");
		tweetService.getTweetForUser($scope.userName)
		.then(function(tweet) {
			angular.copy(tweet, $scope.tweet);
		})
	}
	$scope.getTweet = getTweet;
	
})