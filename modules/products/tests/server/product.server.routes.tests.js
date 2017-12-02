'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Product = mongoose.model('Product'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  product;

/**
 * Product routes tests
 */
describe('Product CRUD tests', function () {

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

    // Save a user to the test db and create new Product
    product = {
      name: 'Product name',
      detail: 'Product detail',
      image: 'image',
      size: [{
        name: 'S',
        price: 40
      }, {
        name: 'M',
        price: 50
      }, {
        name: 'L',
        price: 60
      }],
      category: 'ร้อน',
    };

    done();
  });

  it('should be able to save a Product', function (done) {

    // Save a new Product
    agent.post('/api/products')
      .send(product)
      .expect(200)
      .end(function (productSaveErr, productSaveRes) {
        // Handle Product save error
        if (productSaveErr) {
          return done(productSaveErr);
        }

        var product = productSaveRes.body;

        // Set assertions
        (product.name).should.match(product.name);
        (product.detail).should.match(product.detail);
        (product.image).should.match(product.image);
        (product.size[0].name).should.match(product.size[0].name);
        (product.size[0].price).should.match(product.size[0].price);
        (product.size[1].name).should.match(product.size[1].name);
        (product.size[1].price).should.match(product.size[1].price);
        (product.size[2].name).should.match(product.size[2].name);
        (product.size[2].price).should.match(product.size[2].price);
        (product.count).should.match(0);
        (product.category).should.match(product.category);

        // Call the assertion callback
        done();
      });
  });

  it('should be able to get Product list', function (done) {

    var productObj = new Product(product);
    var productObj2 = new Product(product);
    var productObj3 = new Product(product);
    productObj3.category = 'เย็น';
    var productObj4 = new Product(product);
    productObj4.category = 'เย็น';
    var productObj5 = new Product(product);
    productObj5.category = 'ปั่น';
    var productObj6 = new Product(product);
    productObj6.category = 'ปั่น';

    productObj.save();
    productObj2.save();
    productObj3.save();
    productObj4.save();
    productObj5.save();
    productObj6.save();

    agent.get('/api/products')
      .end(function (productsGetErr, productsGetRes) {
        // Handle Products save error
        if (productsGetErr) {
          return done(productsGetErr);
        }

        // Get Products list
        var product = productsGetRes.body;

        // Set assertions
        (product.hot.length).should.match(2);
        (product.hot[0].name).should.match(productObj.name);
        (product.hot[0].detail).should.match(productObj.detail);
        (product.hot[0].image).should.match(productObj.image);
        (product.hot[0].size[0].name).should.match(productObj.size[0].name);
        (product.hot[0].size[0].price).should.match(productObj.size[0].price);
        (product.hot[0].size[1].name).should.match(productObj.size[1].name);
        (product.hot[0].size[1].price).should.match(productObj.size[1].price);
        (product.hot[0].size[2].name).should.match(productObj.size[2].name);
        (product.hot[0].size[2].price).should.match(productObj.size[2].price);
        (product.hot[0].count).should.match(0);
        (product.hot[0].category).should.match(productObj.category);
        (product.hot[1].name).should.match(productObj2.name);
        (product.hot[1].detail).should.match(productObj2.detail);
        (product.hot[1].image).should.match(productObj2.image);
        (product.hot[1].size[0].name).should.match(productObj2.size[0].name);
        (product.hot[1].size[0].price).should.match(productObj2.size[0].price);
        (product.hot[1].size[1].name).should.match(productObj2.size[1].name);
        (product.hot[1].size[1].price).should.match(productObj2.size[1].price);
        (product.hot[1].size[2].name).should.match(productObj2.size[2].name);
        (product.hot[1].size[2].price).should.match(productObj2.size[2].price);
        (product.hot[1].count).should.match(0);
        (product.hot[1].category).should.match(productObj2.category);

        (product.iced.length).should.match(2);
        (product.iced[0].name).should.match(productObj3.name);
        (product.iced[0].detail).should.match(productObj3.detail);
        (product.iced[0].image).should.match(productObj3.image);
        (product.iced[0].size[0].name).should.match(productObj3.size[0].name);
        (product.iced[0].size[0].price).should.match(productObj3.size[0].price);
        (product.iced[0].size[1].name).should.match(productObj3.size[1].name);
        (product.iced[0].size[1].price).should.match(productObj3.size[1].price);
        (product.iced[0].size[2].name).should.match(productObj3.size[2].name);
        (product.iced[0].size[2].price).should.match(productObj3.size[2].price);
        (product.iced[0].count).should.match(0);
        (product.iced[0].category).should.match(productObj3.category);
        (product.iced[1].name).should.match(productObj4.name);
        (product.iced[1].detail).should.match(productObj4.detail);
        (product.iced[1].image).should.match(productObj4.image);
        (product.iced[1].size[0].name).should.match(productObj4.size[0].name);
        (product.iced[1].size[0].price).should.match(productObj4.size[0].price);
        (product.iced[1].size[1].name).should.match(productObj4.size[1].name);
        (product.iced[1].size[1].price).should.match(productObj4.size[1].price);
        (product.iced[1].size[2].name).should.match(productObj4.size[2].name);
        (product.iced[1].size[2].price).should.match(productObj4.size[2].price);
        (product.iced[1].count).should.match(0);
        (product.iced[1].category).should.match(productObj4.category);

        (product.frappe.length).should.match(2);
        (product.frappe[0].name).should.match(productObj5.name);
        (product.frappe[0].detail).should.match(productObj5.detail);
        (product.frappe[0].image).should.match(productObj5.image);
        (product.frappe[0].size[0].name).should.match(productObj5.size[0].name);
        (product.frappe[0].size[0].price).should.match(productObj5.size[0].price);
        (product.frappe[0].size[1].name).should.match(productObj5.size[1].name);
        (product.frappe[0].size[1].price).should.match(productObj5.size[1].price);
        (product.frappe[0].size[2].name).should.match(productObj5.size[2].name);
        (product.frappe[0].size[2].price).should.match(productObj5.size[2].price);
        (product.frappe[0].count).should.match(0);
        (product.frappe[0].category).should.match(productObj5.category);
        (product.frappe[1].name).should.match(productObj6.name);
        (product.frappe[1].detail).should.match(productObj6.detail);
        (product.frappe[1].image).should.match(productObj6.image);
        (product.frappe[1].size[0].name).should.match(productObj6.size[0].name);
        (product.frappe[1].size[0].price).should.match(productObj6.size[0].price);
        (product.frappe[1].size[1].name).should.match(productObj6.size[1].name);
        (product.frappe[1].size[1].price).should.match(productObj6.size[1].price);
        (product.frappe[1].size[2].name).should.match(productObj6.size[2].name);
        (product.frappe[1].size[2].price).should.match(productObj6.size[2].price);
        (product.frappe[1].count).should.match(0);
        (product.frappe[1].category).should.match(productObj6.category);
        done();
      });
  });

  afterEach(function (done) {
    Product.remove().exec(done);
  });
});
