var app = angular.module('myApp',['ui.bootstrap','ngRoute']);
app.config(function ($routeProvider) {
	$routeProvider
	/*
		.when('/displayChart', {
			controller: 'ChartViewController',
			templateUrl: 'chart.html'
		})
	*/
		.when('/displayChart', {
			controller: 'ChartSearchController',
			templateUrl: 'chart.html'
		})		
		.when('/reverseLookupDisplay', {
			controller: 'ReverseLookupController',
			templateUrl: 'reverse.html'
		})
		.when('/artistTimeline', {
			controller: 'ArtistTimelineController',
			templateUrl: 'timeline.html'
		})		
		.otherwise({
			redirectTo:'/'
		});
});