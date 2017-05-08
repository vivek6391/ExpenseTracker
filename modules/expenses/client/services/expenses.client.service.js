// Expenses service used to communicate Expenses REST endpoints
(function () {
  'use strict';

  angular
    .module('expenses')
    .factory('ExpensesService', ExpensesService);

  ExpensesService.$inject = ['$resource'];

  function ExpensesService($resource) {
    return $resource('api/expenses/:expenseId', {
      expenseId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
