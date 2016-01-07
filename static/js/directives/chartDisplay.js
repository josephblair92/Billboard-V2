app.directive('chartDisplay', function() {
	return {
		restrict: 'E',
		scope: {
			data: '='
		},
		templateUrl:'js/directives/chartDisplay.html'
	};
});