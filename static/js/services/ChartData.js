app.factory('ChartData',['$http', function($http) {
		//'http://billboardv2-jpblair.herokuapp.com/chart?type=billboard_singles&date=10312015'
		
		
		return function(type,date) {
			var url = '../chart';
			return $http.get(url, {
				params: {
					type: type,
					date: date
				}
			})
			.success(function(data) {
				return data;
			})
			.error(function(err){
				return err;
			});	
		}
	}
]);