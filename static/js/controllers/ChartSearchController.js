app.controller('ChartSearchController', function ($scope) {
  $scope.today = function() {
    var date = new Date();
    while (date.getDay() != 6)
      date.setDate(date.getDate()-1);
    $scope.dt = date;
  };
  $scope.today();
  $scope.minDate = new Date(1940,01,01);

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Only allow Saturdays
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() != 6) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();
  $scope.maxDate = new Date();

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.search = function(date) {
    year=date.getFullYear();
    month=date.getMonth()+1;
    day=date.getDate();

    type=$scope.radioModel;
    if (type === 'Singles')
      type='billboard_singles';
    if (type === 'Albums')
      type='billboard_albums';

    console.log('fire search');
    console.log(type);
    $scope.$root.$emit('loadChart', type, year, month, day);
  }

  $scope.format = 'dd MMMM yyyy';

  $scope.status = {
    opened: false
  };

  $scope.singleModel = 1;

  $scope.radioModel = 'Singles';

  $scope.checkModel = {
    left: false,
    middle: true,
    right: false
  };

  $scope.checkResults = [];

  $scope.$watchCollection('checkModel', function () {
    $scope.checkResults = [];
    angular.forEach($scope.checkModel, function (value, key) {
      if (value) {
        $scope.checkResults.push(key);
      }
    });
  });  

});