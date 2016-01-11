app.factory('ReverseLookupService',['$http', function($http) {		
		
		return function(artist) {
			var url = '../api/reverse/artist';
			return $http.get(url, {
				params: {
					artist: artist
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