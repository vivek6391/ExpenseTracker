(function () {
  'use strict';

  // Expenses controller
  angular
    .module('expenses')
    .controller('ExpensesController', ExpensesController);

  ExpensesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'expenseResolve'];

  function ExpensesController ($scope, $state, $window, Authentication, expense) {
    var vm = this;

    vm.authentication = Authentication;
    vm.expense = expense;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.open = function($event) {
        $scope.status.opened = true;
    };

    $scope.status = {
        opened: false
    };

    // Remove existing Expense
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.expense.$remove($state.go('expenses.list'));
      }
    }

    // Save Expense
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.expenseForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.expense._id) {
        vm.expense.$update(successCallback, errorCallback);
      } else {
        vm.expense.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('expenses.view', {
          expenseId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
