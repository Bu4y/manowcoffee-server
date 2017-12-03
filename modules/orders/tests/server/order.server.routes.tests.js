'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Order = mongoose.model('Order'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  order;

/**
 * Order routes tests
 */
describe('Order CRUD tests', function () {

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

    // Save a user to the test db and create new Order
    user.save(function () {
      order = {
        table: '1',
        items: [{
          _id: '123',
          name: 'String',
          image: 'String',
          size: 'String',
          qty: 7,
          price: 50,
          amount: 350
        }, {
          _id: '1234',
          name: 'String4',
          image: 'String4',
          size: 'String4',
          qty: 5,
          price: 50,
          amount: 250
        }],
        totalamount: 600,
      };

      done();
    });
  });

  it('should be able to save a Order if logged in', function (done) {
    agent.post('/api/orders')
      .send(order)
      .expect(200)
      .end(function (orderSaveErr, orderSaveRes) {
        // Handle Order save error
        if (orderSaveErr) {
          return done(orderSaveErr);
        }

        // Get a list of Orders
        agent.get('/api/orders')
          .end(function (ordersGetErr, ordersGetRes) {
            // Handle Orders save error
            if (ordersGetErr) {
              return done(ordersGetErr);
            }

            // Get Orders list
            var orders = ordersGetRes.body;

            // Set assertions
            (orders[0].table).should.match(order.table);
            (orders[0].totalamount).should.match(order.totalamount);
            (orders[0].items.length).should.match(2);
            (orders[0].items[0]._id).should.match(order.items[0]._id);
            (orders[0].items[1]._id).should.match(order.items[1]._id);

            // Call the assertion callback
            done();
          });
      });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Order.remove().exec(done);
    });
  });
});
