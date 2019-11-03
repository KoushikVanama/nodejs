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

// Init fucntion
// app.init = function(){
app.init = function(callback){
  // start server
  server.init();
  //start workers
  workers.init();

  // Start the CLI, but make sure it starts last
  setTimeout(function(){
    cli.init();
    callback(); // Callback needed for api test
  },50);
};

// Execute
// app.init();

// self invoking only if required directly
if(require.main == module){
  app.init(function(){}); // Callback needed for api test
}

module.exports = app;
