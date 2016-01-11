app.directive('chartDisplay', function() {
	return {
		restrict: 'E',
		scope: {
			data: '=',
			type: '='
		},
		templateUrl:'js/directives/chartDisplay.html',
		link: function($scope,element,attrs) {
			$scope.getYoutubeSearchURL = function(artist, item) {
				var base = 'https://www.youtube.com/results?search_query=';
				return $scope.getExternalSearchURL(base, artist, item);
			};

			$scope.getSpotifySearchURL = function(artist, item) {
				var base = 'https://player.spotify.com/search/';
				return $scope.getExternalSearchURL(base, artist, item);
			};

			$scope.getExternalSearchURL = function(base, artist, item) {
				return base + encodeURIComponent(artist + ' ' + item);
			};

			$scope.getArtistReverseLookupURL = function(artist) {
				return '#/reverseLookupDisplay?artist=' + encodeURIComponent(artist);
			};

			$scope.getItemReverseLookupURL = function(artist, item, chartType) {
				return '#/reverseLookupDisplay?artist=' + encodeURIComponent(artist) + '&item=' + encodeURIComponent(item) + '&chartType=' + chartType;
			};			

		}
	};
});