(function () {
  'use strict';

  angular
    .module('expenses')
    .controller('ExpensesDashboardController', ExpensesDashboardController);

    ExpensesDashboardController.$inject = ['$scope', 'ExpensesService', 'Authentication'];

  function ExpensesDashboardController($scope, ExpensesService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;

    $scope.avg = 0;
    $scope.result = [];
    $scope.startDate = new Date();
    $scope.endDate = new Date();

    $scope.clear = function () {
        $scope.st = null;
    };

      $scope.open = function($event) {
          $scope.status.opened = true;
      };

      $scope.status = {
          opened: false
      };

      $scope.open1 = function($event) {
          $scope.status1.opened = true;
      };

      $scope.status1 = {
          opened: false
      };

    $scope.calcAvg = function (isdate) {
        if ($scope.result.length != 0) {
            var expenses = $scope.result;
            var sum = 0;
            var start = expenses[0].transactiondate;
            var end = expenses[0].transactiondate;
            for (var i = 0 ; i < expenses.length ; i++) {
                var exp = expenses[i];
                if (exp.user._id === Authentication.user._id) {
                    if (!isdate) {
                        sum += exp.amount;
                        if (start > exp.transactiondate)
                            start = exp.transactiondate;
                        if (end < exp.transactiondate)
                            end = exp.transactiondate;
                    }
                    else {
                      if (new Date(exp.transactiondate) > $scope.startDate && new Date(exp.transactiondate) < $scope.endDate) {
                          sum += exp.amount;
                          start = $scope.startDate;
                          end = $scope.endDate;
                      }
                    }
                }
            }
            var w = weeks_between(new Date(start),new Date(end));
            if (w !== 0) {
                $scope.avg = sum /w ;
            }
            else {
                $scope.avg = sum/1;
            }
        }
    };

      function weeks_between(date1, date2) {
          // The number of milliseconds in one week
          var ONE_WEEK = 1000 * 60 * 60 * 24 * 7;
          // Convert both dates to milliseconds
          var date1_ms = date1.getTime();
          var date2_ms = date2.getTime();
          // Calculate the difference in milliseconds
          var difference_ms = Math.abs(date1_ms - date2_ms);
          // Convert back to weeks and return hole weeks
          return Math.floor(difference_ms / ONE_WEEK);
      }

    vm.expenses = ExpensesService.query();
    vm.expenses.$promise.then(function(expenses) {
        $scope.result = expenses;
        $scope.calcAvg(false);
    });
  }
}());
