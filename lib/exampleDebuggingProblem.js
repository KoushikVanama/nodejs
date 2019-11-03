/*
* Library that demonstrates something throwing when its init() is called
*
*/

var example = {};

example.init = function(){
  // this is an error created intentionally(bar is not defined)
  var foo = bar;
};

module.exports = example;
