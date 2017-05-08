(function () {
  'use strict';

  angular
    .module('expenses')
    .controller('AllExpensesListController', ExpensesListController);

  ExpensesListController.$inject = ['ExpensesService'];

  function ExpensesListController(ExpensesService) {
    var vm = this;

    vm.expenses = ExpensesService.query();
  }
}());
