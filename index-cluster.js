/*
* Primary file for the API
*
*/

// Dependencies
var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');
var cluster = require('cluster');
var os = require('os');

// Declare the app
var app = {};

// Init fucntion
// app.init = function(){
app.init = function(callback){
 // If we're on master thread, start workers and CLI
  if(cluster.isMaster){
    //start workers
    workers.init();

    // Start the CLI, but make sure it starts last
    setTimeout(function(){
      cli.init();
      callback(); // Callback needed for api test
    },50);

    // Fork the process
    for(var i = 0; i < os.cpus().length;i++){
      cluster.fork();
    }
  } else {
    // If we're not on master thread, start HTTP server
    server.init();
  }
};

// Execute
// app.init();

// self invoking only if required directly
if(require.main == module){
  app.init(function(){}); // Callback needed for api test
}

module.exports = app;
