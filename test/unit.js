/*
* Unit Tests
*
*/

var helpers = require('./../lib/helpers');
var assert = require('assert');
var logs = require('./../lib/logs');
var exampleDebuggingProblem = require('./../lib/exampleDebuggingProblem');

// Holder for tests
var unit = {};

// Assert that getANumber is returning a number
unit['helpers.getANumber should return number'] = function(done){
  var val = helpers.getANumber();
  assert.equal(typeof(val), 'number');
  done();
};

// Assert that getANumber is returning a 1
unit['helpers.getANumber should return 1'] = function(done){
  var val = helpers.getANumber();
  assert.equal(val, 1);
  done();
};

// Assert that getANumber is returning a 2
unit['helpers.getANumber should return 2'] = function(done){
  var val = helpers.getANumber();
  assert.equal(val, 2);
  done();
};

// logs.list should callback an array and false error
unit['logs.list should callback a false error and an array of log names'] = function(done){
  logs.list(true, function(err, logFileNames){
    assert.equal(err, false);
    assert.ok(logFileNames instanceof Array);
    assert.ok(logFileNames.length > 1);
    done();
  });
};

// Logs.truncate should not throw if logId doesnt exist
unit['logs.truncate should not throw if log id doesn\'t exists'] = function(done){
  assert.doesNotThrow(function(){
    logs.truncate("I do not exist", function(err){
      assert.ok(err);
      done();
    });
  }, TypeError);
};

// exampleDebuggingProblem.init should not throw (but it does)
unit['exampleDebuggingProblem.init should not return throw when called'] = function(done){
  assert.doesNotThrow(function(){
    exampleDebuggingProblem.init();
    done();
  }, TypeError);
};


module.exports = unit;
