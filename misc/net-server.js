/*
* Example TCP (Net) Server
* Listens to port 6000 and sends word "pong" to client
*/

var net = require('net');

var server = net.createServer(function(connection){
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
