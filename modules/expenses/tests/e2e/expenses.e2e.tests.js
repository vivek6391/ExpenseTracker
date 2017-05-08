'use strict';

describe('Expenses E2E Tests:', function () {
  describe('Test Expenses page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/expenses');
      expect(element.all(by.repeater('expense in expenses')).count()).toEqual(0);
    });
  });
});
