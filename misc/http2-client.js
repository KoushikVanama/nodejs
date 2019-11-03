/*
* Example HTTP2 client
*
*/

var http2 = require('http2');

var client = http2.connect('http://localhost:6000');

// create a request
var req = client.request({
  ':path': '/'
});

// When a message is received, add pieces of it together until you reach the end
var str = '';
req.on('data', function(chunk){
  str += chunk;
});

// When message end, log it out
req.on('end', function(){
  console.log(str);
})

// End request
req.end();
