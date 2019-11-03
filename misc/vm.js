/*
* Example VM
*
*/

var vm = require('vm');

// define a context for the script to run in
var context = {
  'foo': 25
};

// Define script
var script = new vm.Script(`
  foo = foo * 2;
  var bar = foo + 1;
  var fizz = 52;
`);

// Run script
script.runInNewContext(context);
console.log(context);
