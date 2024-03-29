/*
* Example TLS Server
* Listens to port 6000 and sends word "pong" to clients
*/

var tls = require('tls');
var fs = require('fs');
var path = require('path');

// server options
var options = {
  'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
  'cert': fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
};

var server = tls.createServer(options, function(connection){
  // Send word 'pong'
  var outboundMessage = "pong";
  connection.write(outboundMessage);
  // When client writes something, log it out
  connection.on('data', function(inboundMessage){
    var messageString = inboundMessage.toString();
    console.log("I wrote "+ outboundMessage+" and they said "+inboundMessage);
  });
});

server.listen(6000);
