'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Expense = mongoose.model('Expense'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  expense;

/**
 * Expense routes tests
 */
describe('Expense CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Expense
    user.save(function () {
      expense = {
        name: 'Expense name'
      };

      done();
    });
  });

  it('should be able to save a Expense if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Expense
        agent.post('/api/expenses')
          .send(expense)
          .expect(200)
          .end(function (expenseSaveErr, expenseSaveRes) {
            // Handle Expense save error
            if (expenseSaveErr) {
              return done(expenseSaveErr);
            }

            // Get a list of Expenses
            agent.get('/api/expenses')
              .end(function (expensesGetErr, expensesGetRes) {
                // Handle Expenses save error
                if (expensesGetErr) {
                  return done(expensesGetErr);
                }

                // Get Expenses list
                var expenses = expensesGetRes.body;

                // Set assertions
                (expenses[0].user._id).should.equal(userId);
                (expenses[0].name).should.match('Expense name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Expense if not logged in', function (done) {
    agent.post('/api/expenses')
      .send(expense)
      .expect(403)
      .end(function (expenseSaveErr, expenseSaveRes) {
        // Call the assertion callback
        done(expenseSaveErr);
      });
  });

  it('should not be able to save an Expense if no name is provided', function (done) {
    // Invalidate name field
    expense.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Expense
        agent.post('/api/expenses')
          .send(expense)
          .expect(400)
          .end(function (expenseSaveErr, expenseSaveRes) {
            // Set message assertion
            (expenseSaveRes.body.message).should.match('Please fill Expense name');

            // Handle Expense save error
            done(expenseSaveErr);
          });
      });
  });

  it('should be able to update an Expense if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Expense
        agent.post('/api/expenses')
          .send(expense)
          .expect(200)
          .end(function (expenseSaveErr, expenseSaveRes) {
            // Handle Expense save error
            if (expenseSaveErr) {
              return done(expenseSaveErr);
            }

            // Update Expense name
            expense.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Expense
            agent.put('/api/expenses/' + expenseSaveRes.body._id)
              .send(expense)
              .expect(200)
              .end(function (expenseUpdateErr, expenseUpdateRes) {
                // Handle Expense update error
                if (expenseUpdateErr) {
                  return done(expenseUpdateErr);
                }

                // Set assertions
                (expenseUpdateRes.body._id).should.equal(expenseSaveRes.body._id);
                (expenseUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Expenses if not signed in', function (done) {
    // Create new Expense model instance
    var expenseObj = new Expense(expense);

    // Save the expense
    expenseObj.save(function () {
      // Request Expenses
      request(app).get('/api/expenses')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Expense if not signed in', function (done) {
    // Create new Expense model instance
    var expenseObj = new Expense(expense);

    // Save the Expense
    expenseObj.save(function () {
      request(app).get('/api/expenses/' + expenseObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', expense.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Expense with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/expenses/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Expense is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Expense which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Expense
    request(app).get('/api/expenses/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Expense with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Expense if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Expense
        agent.post('/api/expenses')
          .send(expense)
          .expect(200)
          .end(function (expenseSaveErr, expenseSaveRes) {
            // Handle Expense save error
            if (expenseSaveErr) {
              return done(expenseSaveErr);
            }

            // Delete an existing Expense
            agent.delete('/api/expenses/' + expenseSaveRes.body._id)
              .send(expense)
              .expect(200)
              .end(function (expenseDeleteErr, expenseDeleteRes) {
                // Handle expense error error
                if (expenseDeleteErr) {
                  return done(expenseDeleteErr);
                }

                // Set assertions
                (expenseDeleteRes.body._id).should.equal(expenseSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Expense if not signed in', function (done) {
    // Set Expense user
    expense.user = user;

    // Create new Expense model instance
    var expenseObj = new Expense(expense);

    // Save the Expense
    expenseObj.save(function () {
      // Try deleting Expense
      request(app).delete('/api/expenses/' + expenseObj._id)
        .expect(403)
        .end(function (expenseDeleteErr, expenseDeleteRes) {
          // Set message assertion
          (expenseDeleteRes.body.message).should.match('User is not authorized');

          // Handle Expense error error
          done(expenseDeleteErr);
        });

    });
  });

  it('should be able to get a single Expense that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Expense
          agent.post('/api/expenses')
            .send(expense)
            .expect(200)
            .end(function (expenseSaveErr, expenseSaveRes) {
              // Handle Expense save error
              if (expenseSaveErr) {
                return done(expenseSaveErr);
              }

              // Set assertions on new Expense
              (expenseSaveRes.body.name).should.equal(expense.name);
              should.exist(expenseSaveRes.body.user);
              should.equal(expenseSaveRes.body.user._id, orphanId);

              // force the Expense to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Expense
                    agent.get('/api/expenses/' + expenseSaveRes.body._id)
                      .expect(200)
                      .end(function (expenseInfoErr, expenseInfoRes) {
                        // Handle Expense error
                        if (expenseInfoErr) {
                          return done(expenseInfoErr);
                        }

                        // Set assertions
                        (expenseInfoRes.body._id).should.equal(expenseSaveRes.body._id);
                        (expenseInfoRes.body.name).should.equal(expense.name);
                        should.equal(expenseInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Expense.remove().exec(done);
    });
  });
});
