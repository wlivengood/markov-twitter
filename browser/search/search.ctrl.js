app.controller("searchCtrl", function($scope, tweetService) {
	$scope.tweet = {};
	$scope.loading = false;
	$scope.error = false;
	function getTweet() {
		$scope.loading = true;
		tweetService.getTweetForUser($scope.userName)
		.then(function(tweet) {
			if (!tweet.userName) $scope.error = true;
			$scope.loading = false;
			angular.copy(tweet, $scope.tweet);
		})
	}
	$scope.getTweet = getTweet;
	
})