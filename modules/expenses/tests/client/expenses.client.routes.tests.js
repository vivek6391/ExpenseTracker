(function () {
  'use strict';

  describe('Expenses Route Tests', function () {
    // Initialize global variables
    var $scope,
      ExpensesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ExpensesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ExpensesService = _ExpensesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('expenses');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/expenses');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ExpensesController,
          mockExpense;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('expenses.view');
          $templateCache.put('modules/expenses/client/views/view-expense.client.view.html', '');

          // create mock Expense
          mockExpense = new ExpensesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Expense Name'
          });

          // Initialize Controller
          ExpensesController = $controller('ExpensesController as vm', {
            $scope: $scope,
            expenseResolve: mockExpense
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:expenseId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.expenseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            expenseId: 1
          })).toEqual('/expenses/1');
        }));

        it('should attach an Expense to the controller scope', function () {
          expect($scope.vm.expense._id).toBe(mockExpense._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/expenses/client/views/view-expense.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ExpensesController,
          mockExpense;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('expenses.create');
          $templateCache.put('modules/expenses/client/views/form-expense.client.view.html', '');

          // create mock Expense
          mockExpense = new ExpensesService();

          // Initialize Controller
          ExpensesController = $controller('ExpensesController as vm', {
            $scope: $scope,
            expenseResolve: mockExpense
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.expenseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/expenses/create');
        }));

        it('should attach an Expense to the controller scope', function () {
          expect($scope.vm.expense._id).toBe(mockExpense._id);
          expect($scope.vm.expense._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/expenses/client/views/form-expense.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ExpensesController,
          mockExpense;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('expenses.edit');
          $templateCache.put('modules/expenses/client/views/form-expense.client.view.html', '');

          // create mock Expense
          mockExpense = new ExpensesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Expense Name'
          });

          // Initialize Controller
          ExpensesController = $controller('ExpensesController as vm', {
            $scope: $scope,
            expenseResolve: mockExpense
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:expenseId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.expenseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            expenseId: 1
          })).toEqual('/expenses/1/edit');
        }));

        it('should attach an Expense to the controller scope', function () {
          expect($scope.vm.expense._id).toBe(mockExpense._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/expenses/client/views/form-expense.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
