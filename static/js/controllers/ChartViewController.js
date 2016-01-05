app.controller('ChartViewController',['$scope','ChartData',function($scope,ChartData)
	{

		$scope.$root.$on('loadChart', function(event, year, month, day) {
			$scope.loadChart('billboard_singles', year, month, day);
		});

		$scope.loadChart = function(type,year,month,day) {
			if (day < 10)
				day = "0" + day;
			if (month < 10)
				month = "0" + month;
			var dateStr = "" + month + day + year;
			console.log(dateStr);
			ChartData(type,dateStr).success(
				function(data){
					$scope.chartData=data
				}
			);
		};

		$scope.loadChart('billboard_singles',2015,10,31);

	}
]);