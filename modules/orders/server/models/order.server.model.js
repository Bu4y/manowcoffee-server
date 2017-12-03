'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Order Schema
 */
var OrderSchema = new Schema({
  table: {
    type: String
  },
  items: {
    type: [{
      _id: String,
      name: String,
      image: String,
      size: String,
      qty: Number,
      price: Number,
      amount: Number
    }]
  },
  totalamount: {
    type: Number
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

mongoose.model('Order', OrderSchema);
