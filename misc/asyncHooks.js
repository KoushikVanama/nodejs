/*
* Async Hooks
*
*/

var async_hooks = require('async_hooks');
var fs = require('fs');

// Target execution context
var targetExecutionContext = false;

// write arbitrary async funciton
var whatTimeIsIt = function(callback){
  setInterval(function () {
    fs.writeSync(1, 'When setInterval runs, the execution context is '+async_hooks.executionAsyncId()+'\n');
    callback(Date.now());
  }, 1000);
};

// Call that fucntion
whatTimeIsIt(function(time){
  fs.writeSync(1, 'The time is '+time+'\n');
});

// Hooks
var hooks = {
  init(asyncId, type, triggerAsyncId, resource){
    fs.writeSync(1, "Hook init "+asyncId+"\n");
  },
  before(asyncId){
    fs.writeSync(1, "Hook before "+asyncId+"\n");
  },
  after(asyncId){
    fs.writeSync(1, "Hook after "+asyncId+"\n");
  },
  destroy(asyncId){
    fs.writeSync(1, "Hook destroy "+asyncId+"\n");
  },
  promiseResolve(asyncId){
    fs.writeSync(1, "Hook promiseResolve "+asyncId+"\n");
  }
};

// Create a new AsyncHooks instance
var asyncHook = async_hooks.createHook(hooks);
asyncHook.enable();
