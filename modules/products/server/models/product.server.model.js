'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  name: {
    type: String
  },
  detail: {
    type: String
  },
  image: {
    type: String
  },
  size: {
    type: [{
      name: {
        type: String
      },
      price: {
        type: Number
      }
    }]
  },
  count: {
    type: Number,
    default: 0
  },
  category: {
    type: String
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

mongoose.model('Product', ProductSchema);
