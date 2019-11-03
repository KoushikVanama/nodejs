/*
* Primary file for the API
*
*/

// Dependencies
var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');
var exampleDebuggingProblem = require('./lib/exampleDebuggingProblem');

// Declare the app
var app = {};

// Init fucntion
app.init = function(){
  // start server
  console.log('1');
  debugger;
  server.init();
  //start workers
  console.log('2');
  debugger;
  workers.init();

  // Start the CLI, but make sure it starts last
  console.log('3');
  debugger;
  setTimeout(function(){
    cli.init();
    console.log('4');
    debugger;
  },50);
  console.log('5');
  debugger;
  var foo = 1;
  console.log('6');
  debugger;
  foo++;
  console.log('7');
  debugger;
  foo = foo * foo;
  console.log('8');
  debugger;
  foo = foo.toString();
  console.log('9');
  debugger;
  // call init script that will throw
  exampleDebuggingProblem.init();
};

// Execute
app.init();

module.exports = app;
