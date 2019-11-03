/*
* UDP client
* Sending a message to UDP server on 6000
*/

var dgram = require('dgram');

var client = dgram.createSocket('udp4');

// Define message and pull it into a buffer
var messageString = 'This is a message';
var messageBuffer = Buffer.from(messageString);

// Send message
client.send(messageBuffer, 6000, 'localhost', function(err){
  client.close();
})
