app.directive('reverseLookupDisplay', function() {
		return {
			restrict: 'E',
			scope: {
				data:'=',
				selectedItemData:'='
			},
			link: function($scope, element, attrs) {
				$scope.dateStrToDate = function(dateStr) {
					var dateComponents = dateStr.split('-');
					date = new Date(dateComponents[0],dateComponents[1]-1,dateComponents[2]);
					return date;
				}				
			},
			templateUrl:'js/directives/reverseLookupDisplay.html'
		};
	}
);