'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Expense = mongoose.model('Expense'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Expense
 */
exports.create = function(req, res) {
  var expense = new Expense(req.body);
  expense.user = req.user;

  expense.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(expense);
    }
  });
};

/**
 * Show the current Expense
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var expense = req.expense ? req.expense.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  expense.isCurrentUserOwner = req.user && expense.user && expense.user._id.toString() === req.user._id.toString();

  res.jsonp(expense);
};

/**
 * Update a Expense
 */
exports.update = function(req, res) {
  var expense = req.expense;

  expense = _.extend(expense, req.body);

  expense.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(expense);
    }
  });
};

/**
 * Delete an Expense
 */
exports.delete = function(req, res) {
  var expense = req.expense;

  expense.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(expense);
    }
  });
};

/**
 * List of Expenses
 */
exports.list = function(req, res) {
    Expense.find().sort('-created').populate('user', 'displayName').exec(function(err, expenses) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(expenses);
        }
    });
};

/**
 * dashboard of Expenses
 */
exports.dashboard = function(req, res) {
    console.log('dashboard');
    Expense.find().sort('-created').populate('user', 'displayName').exec(function(err, expenses) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(expenses);
        }
    });
};

/**
 * Expense middleware
 */
exports.expenseByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Expense is invalid'
    });
  }

  Expense.findById(id).populate('user', 'displayName').exec(function (err, expense) {
    if (err) {
      return next(err);
    } else if (!expense) {
      return res.status(404).send({
        message: 'No Expense with that identifier has been found'
      });
    }
    req.expense = expense;
    next();
  });
};
