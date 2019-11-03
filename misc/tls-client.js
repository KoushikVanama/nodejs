/*
* Example TLS Client
* connects to port 6000 and send the word "ping" to servers
*/

var tls = require('tls');
var fs = require('fs');
var path = require('path');

// server options
var options = {
  'ca': fs.readFileSync(path.join(__dirname,'/../https/cert.pem')) // This is only requred because we are using self-singed certificate
};

// define message to send
var outboundMessage = 'ping';

var client = tls.connect(6000, options, function(){
  client.write(outboundMessage);
});

// when server writes back, log back what is says and kill it
client.on('data', function(inboundMessage){
  var messageString = inboundMessage.toString();
  console.log("I wrote "+ outboundMessage+" and they said "+inboundMessage);
  client.end();
});
