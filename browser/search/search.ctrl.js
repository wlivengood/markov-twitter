app.controller("searchCtrl", function($scope, tweetService) {
	$scope.tweet = {};
	$scope.loading = false;
	function getTweet() {
		$scope.loading = true;
		tweetService.getTweetForUser($scope.userName)
		.then(function(tweet) {
			$scope.loading = false;
			angular.copy(tweet, $scope.tweet);
		})
	}
	$scope.getTweet = getTweet;
	
})