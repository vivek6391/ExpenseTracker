'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Expense = mongoose.model('Expense');

/**
 * Globals
 */
var user,
  expense;

/**
 * Unit tests
 */
describe('Expense Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      expense = new Expense({
        name: 'Expense Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return expense.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

      it('should be able to show an error when try to save without title', function(done) {
          expense.title = '';

          return expense.save(function(err) {
              should.exist(err);
              done();
          });
      });
      it('==========================================should be able to show an error when try to save without amount', function(done) {
          expense.title = '234';

          return expense.save(function(err) {
              should.exist(err);
              done();
          });
      });
      it('should be able to show an error when try to save without date', function(done) {
          expense.title = '2332';
          expense.amount = 123;
          return expense.save(function(err) {
              should.exist(err);
              done();
          });
      });
  });

  afterEach(function(done) {
    Expense.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
