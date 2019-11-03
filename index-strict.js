/*
* Primary file for the API
*
*/

// Dependencies
var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');

// Declare the app
var app = {};

// Declare a global (that strict mode should catch)
foo = 'bar';

// Init fucntion
app.init = function(){
  // start server
  server.init();
  //start workers
  workers.init();

  // Start the CLI, but make sure it starts last
  setTimeout(function(){
    cli.init();
  },50);
};

// Execute
app.init();

module.exports = app;
