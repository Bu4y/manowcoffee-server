'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Table = mongoose.model('Table'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  table;

/**
 * Table routes tests
 */
describe('Table CRUD tests', function () {

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

    // Save a user to the test db and create new Table
    user.save(function () {
      table = {
        name: 'Table name'
      };

      done();
    });
  });

  it('should be able to save a Table if logged in', function (done) {

    agent.post('/api/tables')
      .send(table)
      .expect(200)
      .end(function (tableSaveErr, tableSaveRes) {
        // Handle Table save error
        if (tableSaveErr) {
          return done(tableSaveErr);
        }

        // Get a list of Tables
        agent.get('/api/tables')
          .end(function (tablesGetErr, tablesGetRes) {
            // Handle Tables save error
            if (tablesGetErr) {
              return done(tablesGetErr);
            }

            // Get Tables list
            var tables = tablesGetRes.body;

            // Set assertions
            (tables[0].name).should.match('Table name');

            // Call the assertion callback
            done();
          });
      });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Table.remove().exec(done);
    });
  });
});
