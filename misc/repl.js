/*
* REPL server
* Take in word "fizz" and log out "buzz"
*/

var repl = require('repl');

// start REPL
repl.start({
  'prompt': '>',
  'eval': function(str){
    // Evaluation function for incoming inputs
    console.log('At evalutation stage ', str);
    // If user says 'fizz', say 'buzz'
    if(str.indexOf('fizz') > -1){
      console.log('buzz');
    }
  }
});
