'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Product
 */
exports.create = function (req, res) {
  var product = new Product(req.body);
  product.user = req.user;

  product.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * Show the current Product
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var product = req.product ? req.product.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  product.isCurrentUserOwner = req.user && product.user && product.user._id.toString() === req.user._id.toString();

  res.jsonp(product);
};

/**
 * Update a Product
 */
exports.update = function (req, res) {
  var product = req.product;

  product = _.extend(product, req.body);

  product.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * Delete an Product
 */
exports.delete = function (req, res) {
  var product = req.product;

  product.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * List of Products
 */
exports.list = function (req, res, next) {
  Product.find().sort('-created').populate('user', 'displayName').exec(function (err, products) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.products = products;
      next();
    }
  });
};

exports.cookingData = function (req, res, next) {
  var productCooking = {
    hot: [],
    iced: [],
    frappe: []
  };

  var products = req.products;

  products.forEach(element => {
    if (element.category === 'ร้อน') {
      productCooking.hot.push(element);
    } else if (element.category === 'เย็น') {
      productCooking.iced.push(element);
    } else {
      productCooking.frappe.push(element);
    }
  });

  if (productCooking && productCooking.hot && productCooking.hot.length > 1) {
    productCooking.hot.sort((a, b) => { return (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0); });
  }

  if (productCooking && productCooking.iced && productCooking.iced.length > 1) {
    productCooking.iced.sort((a, b) => { return (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0); });
  }

  if (productCooking && productCooking.frappe && productCooking.frappe.length > 1) {
    productCooking.frappe.sort((a, b) => { return (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0); });
  }

  req.productCooking = productCooking;
  next();
};

exports.resList = function (req, res) {
  res.jsonp(req.productCooking);
};

/**
 * Product middleware
 */
exports.productByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Product is invalid'
    });
  }

  Product.findById(id).populate('user', 'displayName').exec(function (err, product) {
    if (err) {
      return next(err);
    } else if (!product) {
      return res.status(404).send({
        message: 'No Product with that identifier has been found'
      });
    }
    req.product = product;
    next();
  });
};


exports.updateSeller = function (req, res) {
  var qty = req.product.count ? req.product.count : 0;
  qty += req.body.qty ? req.body.qty : 0;
  req.product.count = qty;
  req.product.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(req.product);
    }
  });
};