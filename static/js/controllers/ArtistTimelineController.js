app.controller('ArtistTimelineController', ['$scope','$routeParams','ReverseLookupService',function($scope,$routeParams,ReverseLookupService) {

	var lookup = function(artist) {
		ReverseLookupService(artist).success(
			function(data) {
				var chartedItems = fillPeakDates(data.charted_items);
				setChartedItems(chartedItems);
			}
		)
	};

	var setChartedItems = function(chartedItems) {
		$scope.charted_items = chartedItems;
	}

	var fillPeakDates = function(chartedItems) {
		for (var i = 0; i < chartedItems.length; i++) {
			chartedItems[i] = fillPeakDate(chartedItems[i]);
		}
		return chartedItems;
	}

	var fillPeakDate = function(chartedItem) {
		var entries = chartedItem.entries;
		var peakPosition = entries[0].position;
		var peakDate;
		for (var i = 0; i < entries.length; i++) {
			var entry = entries[i];
			if (entry.position <= peakPosition) {
				peakPosition = entry.position;
				peakDate = entry.date;
			}
		}
		chartedItem.peak_date = peakDate;
		return chartedItem;
	}

	$scope.search = function() {
		var artist = $scope.artistInput;
		lookup(artist);
	}

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
		var featuringStrings = [' Featuring', ' With'];
		for (var i = 0; i < featuringStrings.length; i++) {
			if (artist.indexOf(featuringStrings[i]) > -1)
				artist = artist.substring(0,artist.indexOf(featuringStrings[i]));
		}
		return '#/reverseLookupDisplay?artist=' + encodeURIComponent(artist);
	};

	$scope.getItemReverseLookupURL = function(artist, item, chartType) {
		return '#/reverseLookupDisplay?artist=' + encodeURIComponent(artist) + '&item=' + encodeURIComponent(item) + '&chartType=' + chartType;
	};	

}]);