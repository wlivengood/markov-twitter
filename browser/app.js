var app = angular.module("app", ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider.state('home', {
		url: '/',
		templateUrl: '/home.html'
	})
	.state('search', {
		url: '/search',
		templateUrl: '/search/search.html',
		controller: 'searchCtrl'
	})
	.state('precomputed', {
		url: '/precomputed',
		templateUrl: '/precomputed/precomputed.html'
	});

	$urlRouterProvider.otherwise('/');
});