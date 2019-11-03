/*
* Example TCP (Net) Client
* connects to port 6000 and send the word "ping" to server
*/

var net = require('net');

// define message to send
var outboundMessage = 'ping';

var client = net.createConnection({'port': 6000}, function(){
  client.write(outboundMessage);
});

// when server writes back, log back what is says and kill it
client.on('data', function(inboundMessage){
  var messageString = inboundMessage.toString();
  console.log("I wrote "+ outboundMessage+" and they said "+inboundMessage);
  client.end();
});
