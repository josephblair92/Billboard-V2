app.controller('DatepickerDemoCtrl', function ($scope) {
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
    console.log('fire search');
    $scope.$root.$emit('loadChart', year, month, day);
  }

  $scope.format = 'dd MMMM yyyy';

  $scope.status = {
    opened: false
  };

});