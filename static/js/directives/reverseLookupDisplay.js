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
				};
				$scope.getChartDisplayURL = function(dateStr,chartType) {

					var date = $scope.dateStrToDate(dateStr);
					var day = date.getDate();
					var month = date.getMonth()+1;
					var year = date.getFullYear();

					if (day < 10)
						day = "0" + day;
					if (month < 10)
						month = "0" + month;

					return '#/displayChart?date=' + year + month + day + '&chartType=' + chartType;
				};				
			},
			templateUrl:'js/directives/reverseLookupDisplay.html'
		};
	}
);