/*
* API tests
*
*/

var app = require('./../index');
var assert = require('assert');
var http = require('http');
var config = require('./../lib/config');

var api = {};

var helpers = {};
helpers.makeGetRequest = function(path, callback){
  // configure request details
  var requestDetails = {
    'protocol': 'http:',
    'hostname': 'localhost',
    'port': config.httpPort,
    'method': 'GET',
    'path': path,
    'headers': {
      'Content-Type': 'application/json'
    }
  };
  // send request
  var req = http.request(requestDetails, function(res){
    callback(res);
  });
  req.end();
};

// Main init() should be able to run without throwing
api['app.init should start without throwing'] = function(done){
  assert.doesNotThrow(function(){
    app.init(function(err){
      done();
    });
  }, TypeError);
};

// Make request to ping
api['/ping should respond to GET with 200'] = function(done){
  helpers.makeGetRequest('/ping', function(res){
    assert.equal(res.statusCode, 200);
    done();
  });
};

// Make request to /api/users
api['/api/users should respond to GET with 400'] = function(done){
  helpers.makeGetRequest('/api/users', function(res){
    assert.equal(res.statusCode, 400);
    done();
  });
};

// Make request to random path
api['A random path should respond to GET with 404'] = function(done){
  helpers.makeGetRequest('/this/path/shouldnt/exist', function(res){
    assert.equal(res.statusCode, 404);
    done();
  });
};

module.exports = api;
