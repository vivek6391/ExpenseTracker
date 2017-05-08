'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Expense Schema
 */
var ExpenseSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Please fill Expense name',
    trim: true
  },
  amount: {
    type: Number,
    required: 'Please fill Amount'
  },
  description: {
    type: String,
  },
  transactiondate: {
      type: Date,
      required: 'Please fill Date',
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Expense', ExpenseSchema);
