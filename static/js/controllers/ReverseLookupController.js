app.controller('ReverseLookupController', ['$scope','ReverseLookupService',function($scope,ReverseLookupService) {
	
	$scope.search = function() {
		$scope.loading = true;
		var artist = $scope.artistInput;
		ReverseLookupService(artist).success(
			function(data) {
				$scope.data = data;
				$scope.loading = false;
			}
		);
	};

	$scope.loading=false;
	//$scope.artistInput="Genesis";
	//$scope.search();	

	$scope.translateChartTypeToItemType = function(chartType) {
		if (chartType === 'billboard_singles')
			return 'single';
		if (chartType === 'billboard_albums')
			return 'album';
	}

	$scope.displayItemData = function(index) {
		$scope.selectedItemData = $scope.data.charted_items[index];
	}

	$scope.dateStrToDate = function(dateStr) {
		var dateComponents = dateStr.split('-');
		date = new Date(dateComponents[0],dateComponents[1]-1,dateComponents[2]);
		return date;
	}

}]);