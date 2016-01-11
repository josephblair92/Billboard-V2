app.factory('ChartData',['$http', function($http) {
		//'http://billboardv2-jpblair.herokuapp.com/chart?type=billboard_singles&date=10312015'
		
		
		return function(type,date) {
			var url = '../api/chart';
			return $http.get(url, {
				params: {
					type: type,
					date: date
				}
			})
			.success(function(data) {
				var date = data.date;
				var dateComponents = date.split('-');
				date = new Date(dateComponents[0],dateComponents[1]-1,dateComponents[2]);
				data.date=date;
				//console.log(date);
				return data;
			})
			.error(function(err){
				return err;
			});	
		}
	}
]);