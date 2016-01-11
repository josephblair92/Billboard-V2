app.controller('ReverseLookupController', ['$scope','$routeParams','ReverseLookupService',function($scope,$routeParams,ReverseLookupService) {
	
	$scope.search = function() {
		$scope.loading = true;
		var artist = $scope.artistInput;
		ReverseLookupService(artist).success(
			function(data) {
				$scope.data = data;
				$scope.loading = false;
				<!-- $scope.displayItemData(5); -->
			}
		);
	};

	$scope.loading=false;
	//$scope.artistInput="Genesis";
	//$scope.search();	

	//$scope.selectedItemData = JSON.parse("{\"chart_type\": \"billboard_singles\",\"dropoff_position\": 98,\"entries\": [{\"date\": \"1978-04-22\",\"position\": 83},{\"date\": \"1978-04-29\",\"position\": 71},{\"date\": \"1978-05-06\",\"position\": 61},{\"date\": \"1978-05-13\",\"position\": 53},{\"date\": \"1978-05-20\",\"position\": 47},{\"date\": \"1978-05-27\",\"position\": 41},{\"date\": \"1978-06-03\",\"position\": 37},{\"date\": \"1978-06-10\",\"position\": 35},{\"date\": \"1978-06-17\",\"position\": 29},{\"date\": \"1978-06-24\",\"position\": 23},{\"date\": \"1978-07-01\",\"position\": 23},{\"date\": \"1978-07-08\",\"position\": 54},{\"date\": \"1978-07-15\",\"position\": 54},{\"date\": \"1978-07-22\",\"position\": 53},{\"date\": \"1978-07-29\",\"position\": 59},{\"date\": \"1978-08-05\",\"position\": 98}],\"entry_position\": 83,\"item_name\": \"Follow You, Follow Me\",\"peak_position\": 23}");

	$scope.translateChartTypeToItemType = function(chartType) {
		if (chartType === 'billboard_singles')
			return 'single';
		if (chartType === 'billboard_albums')
			return 'album';
	}

	$scope.displayItemData = function(index) {
		$scope.selectedItemData = $scope.data.charted_items[index];
		$scope.drawChart();
	}

	$scope.displayItemDataByName = function(itemName,chartType) {
		var items = $scope.data.charted_items;
		console.log('function executing');
		for (var i = 0; i < items.length; i++) {
			console.log(items[i].item_name);
			console.log(items[i].chart_type);
			if (items[i].item_name === itemName && items[i].chart_type === chartType) {
				$scope.displayItemData(i);
			}
		}
	}

	$scope.dateStrToDate = function(dateStr) {
		var dateComponents = dateStr.split('-');
		date = new Date(dateComponents[0],dateComponents[1]-1,dateComponents[2]);
		return date;
	}

	if ($routeParams.artist) {
		var artist = $routeParams.artist;
		console.log(artist);
		$scope.artistInput = artist;
		$scope.search();

		if ($routeParams.item && $routeParams.chartType) {
			var itemName = $routeParams.item;
			var chartType = $routeParams.chartType;
			console.log(itemName);
			setTimeout(function(){$scope.displayItemDataByName(itemName,chartType)},3000);
		}

	}

}]);