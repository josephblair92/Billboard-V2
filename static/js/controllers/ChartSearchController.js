app.controller('ChartSearchController', ['$scope', '$routeParams', function ($scope,$routeParams) {
  $scope.today = function() {
    var date = new Date();
    while (date.getDay() != 6)
      date.setDate(date.getDate()-1);
    $scope.dt = date;
  };
  $scope.minDate = new Date(1940,01,01);

  // Only allow Saturdays
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() != 6) );
  };

  $scope.datepickerPopup = {
    opened: false
  };

  $scope.dateOptions = {
    showWeeks: false
  }

  $scope.open = function() {
    $scope.datepickerPopup.opened = true;
  };  

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();
  $scope.maxDate = new Date();

  $scope.setDate = function(year, month, day) {
    $scope.setDT(new Date(year, month, day));
  };

  $scope.setDT = function(dt) {
    $scope.dt = dt;
  }

  $scope.prevWeek = function(dt) {
    if (dt != null) {
      var date = getDateCopy(dt);
      return new Date(date.setDate(date.getDate()-7));    
    }
  }

  $scope.nextWeek = function(dt) {
    if (dt != null) {
      var date = getDateCopy(dt);
      return new Date(date.setDate(date.getDate()+7));    
    }
  }


  $scope.oneWeekForward = function() {
    var date = $scope.nextWeek($scope.dt);
    $scope.setDT(date);
    $scope.search(date);
  }

  $scope.oneWeekBackward = function() {
    var date = $scope.prevWeek($scope.dt);
    $scope.setDT(date);
    $scope.search(date);
  }

  var getDateCopy = function(date) {
    /*
    year=date.getFullYear();
    month=date.getMonth();
    day=date.getDate();
    return new Date(year,month,day);
    */
    return new Date(date);
  }

  $scope.selectDate = function(dt) {
    //console.log(dt);
    $scope.setDT(dt);
    $scope.search(dt);
  }

  $scope.search = function(date) {
    year=date.getFullYear();
    month=date.getMonth()+1;
    day=date.getDate();

    type=$scope.radioModel;

    $scope.$root.$emit('loadChart', type, year, month, day);
  }

  $scope.format = 'dd MMMM yyyy';

  $scope.status = {
    opened: false
  };

  $scope.singleModel = 1;

  $scope.radioModel = 'billboard_singles';

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

  if ($routeParams.chartType) {
    $scope.radioModel=$routeParams.chartType;
  }  

  if ($routeParams.date) {
    var dateStr = $routeParams.date;
    var year = parseInt(dateStr.substring(0,4));
    var month = parseInt(dateStr.substring(4,6))-1;
    var day = parseInt(dateStr.substring(6));
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      $scope.setDate(year,month,day);
      setTimeout($scope.search,50,new Date(year, month, day));
    }
  }

}]);