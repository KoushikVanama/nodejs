/*
* Server related tasks
*
*/

//Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
// var querystring = require('querystring');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');
var _data = require('./data');
var handlers = require('./handlers');
var helpers = require('./helpers');
var path = require('path');
var util = require('util');
var debug = util.debuglog('server');

// Instantiate the server moudle object
var server = {};

// @TODO get rid of this - fulfilled
// helpers.sendTwilioSms('1234567890', 'Hey!!', function(err){
//   console.log('Error', err);
// });

// Testing
// @TODO delete this
// _data.create('test', 'newFile',{'foo' : 'bar'},function(err){
//   console.log('Error:', err);
// });
// _data.read('test', 'newFile2', function(err, data){
//   console.log('Error:', err, '\nData:', data);
// });
// _data.update('test', 'newFile',{'fizz': 'buzz'},function(err){
//   console.log('Error:', err);
// });
// _data.delete('test', 'newFile',function(err){
//   console.log('Error:', err);
// });


// the server should respond to all requests with a string
server.httpServer = http.createServer(function(req, res){
  server.unifiedServer(req, res);
});

server.httpServerOptions = {
  'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
  'cert': fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
};
server.httpsServer = http.createServer(server.httpServerOptions, function(req, res){
  server.unifiedServer(req, res);
});

server.unifiedServer = function(req, res){

    // Get the url and parse it
    var parsedUrl = url.parse(req.url,true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');

    // Get the query string as an object
    var queryStringObject = parsedUrl.query;

    // Get the HTTP method
    var method = req.method.toLowerCase();

    // Get the headers as an object
    var headers = req.headers;

    // Get the payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data){
      buffer += decoder.write(data);
    });
    req.on('end',function(){
      buffer += decoder.end();

      // choose the handler the request should go.
      var chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;
      // If request is within public directory, use the public handler instead
      chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;
      // Construct the data object to send to the handler
      var data = {
        'trimmedPath': trimmedPath,
        'method': method,
        'queryStringObject': queryStringObject,
        'headers': headers,
        'payload': helpers.parseJsonToObject(buffer)
      };

      // Route the request to handler specified in the router
      try{
        chosenHandler(data, function(statusCode, payload, contentType){
          server.processHandlerResponse(res, method, trimmedPath, statusCode, payload, contentType);
        });
      } catch(e){
        debug(e);
        server.processHandlerResponse(res, method, trimmedPath, 500, {'error': 'Somthing went wrong'}, 'json');
      }

      // Send the response
      // res.end("Hello World\n");

      // Log the request path
      // console.log('Request received on path: '+ trimmedPath+' with method: '+ method+' and with these query string parameters', queryStringObject,`and with these headers`,headers );
      // console.log('payload:', buffer);
    });
};

// Process the response from handler
server.processHandlerResponse = function(res, method, trimmedPath, statusCode, payload, contentType){
  // Determine type of response(fallback to JSON)
  contentType = typeof(contentType) == 'string' ? contentType : 'json';

  statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
  // Return the response parts that are content-specific
  var payloadString = '';
  if(contentType == 'json'){
    res.setHeader('Content-Type','application/json');
    payload = typeof(payload) == 'object' ? payload : {};
    payloadString = JSON.stringify(payload);
  }
  if(contentType == 'html'){
    res.setHeader('Content-Type','text/html');
    payloadString = typeof(payload) == 'string' ? payload : '';
  }
  if(contentType == 'favicon'){
    res.setHeader('Content-Type','image/x-icon');
    payloadString = typeof(payload) !== 'undefined' ? payload : '';
  }
  if(contentType == 'css'){
    res.setHeader('Content-Type','text/css');
    payloadString = typeof(payload) !== 'undefined' ? payload : '';
  }
  if(contentType == 'png'){
    res.setHeader('Content-Type','image/png');
    payloadString = typeof(payload) !== 'undefined' ? payload : '';
  }
  if(contentType == 'jpg'){
    res.setHeader('Content-Type','image/jpeg');
    payloadString = typeof(payload) !== 'undefined' ? payload : '';
  }
  if(contentType == 'plain'){
    res.setHeader('Content-Type','text/plain');
    payloadString = typeof(payload) !== 'undefined' ? payload : '';
  }
  // Return the response-parts that are common to  all content-types
  // res.writeHead(statusCode, {'Content-Type': 'application/json'});
  // res.setHeader('Content-Type', 'application/json'); // can be used instead sending as 2nd arg in above line function
  res.writeHead(statusCode);
  res.end(payloadString);
  // console.log('Returning with:', statusCode, payloadString, contentType);
  // If response is 200, print green otherwise print red
  if(statusCode == 200){
    debug('\x1b[32m%s\x1b[0m', method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
  } else {
    debug('\x1b[31m%s\x1b[0m', method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
  }
};

// Define a request router
server.router = {
  '': handlers.index,
  'account/create': handlers.accountCreate,
  'account/edit': handlers.accountEdit,
  'account/deleted': handlers.accountDeleted,
  'session/create': handlers.sessionCreate,
  'session/deleted': handlers.sessionDeleted,
  'checks/all': handlers.checksList,
  'checks/create': handlers.checksCreate,
  'checks/edit': handlers.checksEdit,
  'sample': handlers.sample,
  'ping': handlers.ping,
  'api/users': handlers.users,
  'api/tokens': handlers.tokens,
  'api/checks': handlers.checks,
  'favicon.ico': handlers.favicon,
  'public': handlers.public,
  'examples/error': handlers.exampleError
};

// Init script
server.init = function(){
  // start the HTTP server
  // start the HTTPS server

  // Start the server, and hve it listen on port 3000
  server.httpServer.listen(config.httpPort, function() {
    console.log('\x1b[36m%s\x1b[0m',"The server listening on port "+ config.httpPort +" now in "+ config.envName);
  });
  // Start the server, and hve it listen on port 3000
  server.httpsServer.listen(config.httpsPort, function() {
    console.log('\x1b[35m%s\x1b[0m',"The server listening on port "+ config.httpsPort +" now in "+ config.envName);
  });
}

module.exports = server;
