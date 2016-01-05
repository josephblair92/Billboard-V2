app.controller('ChartViewController',['$scope','ChartData',function($scope,ChartData)
	{
		ChartData('billboard_singles','10312015').success(
			function(data){
				$scope.chartData=data
			}
		);
		$scope.some_var = 'Hello world';
	}
]);