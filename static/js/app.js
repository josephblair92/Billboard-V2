var app = angular.module('myApp',['ui.bootstrap','ngRoute']);
app.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'index.html'
		})
		.when('/displayChart', {
			controller: 'ChartViewController',
			templateUrl: 'chart.html'
		})
		.when('/reverseLookupDisplay', {
			controller: 'ReverseLookupController',
			templateUrl: 'reverse.html'
		})		
		.otherwise({
			redirectTo: '/'
		});
});