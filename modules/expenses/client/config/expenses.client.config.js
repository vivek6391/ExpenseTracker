(function () {
  'use strict';

  angular
    .module('expenses')
    .run(menuConfig);

  menuConfig.$inject = ['Menus','Authentication'];

  function menuConfig(menuService,Authentication) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Expenses',
      state: 'expenses',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'expenses', {
      title: 'List Expenses',
      state: 'expenses.list'
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'expenses', {
        title: 'Expense Report',
        state: 'expenses.dashboard'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'expenses', {
      title: 'Create Expense',
      state: 'expenses.create',
      roles: ['user']
    });

    if (Authentication.user.userType && Authentication.user.userType === 'Admin') {
        // Add the dropdown create item
        menuService.addSubMenuItem('topbar', 'expenses', {
            title: 'List All Expenses',
            state: 'expenses.alllist',
            roles: ['user']
        });
    }
  }
}());
