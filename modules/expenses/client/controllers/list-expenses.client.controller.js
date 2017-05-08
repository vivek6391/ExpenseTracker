(function () {
  'use strict';

  angular
    .module('expenses')
    .controller('ExpensesListController', ExpensesListController);

  ExpensesListController.$inject = ['ExpensesService', 'Authentication'];

  function ExpensesListController(ExpensesService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;

    vm.expenses = ExpensesService.query();
  }
}());
