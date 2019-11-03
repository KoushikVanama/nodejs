/*
* CLI related tasks
*
*/

// Dependencies
var readline = require('readline');
var util = require('util');
var debug = util.debuglog('cli');
var events = require('events');
class _events extends events{};
var e = new _events();
var os = require('os');
var v8 = require('v8');
var _data = require('./data');
var _logs = require('./logs');
var helpers = require('./helpers');
var childProcess = require('child_process');

// Instantiate CLI module object
var cli = {};

// Input handlers
e.on('man', function(str) {
  cli.responders.help();
});

e.on('help', function(str) {
  cli.responders.help();
});

e.on('exit', function(str) {
  cli.responders.exit();
});

e.on('stats', function(str) {
  cli.responders.stats();
});

e.on('list users', function(str) {
  cli.responders.listUsers();
});

e.on('more user info', function(str) {
  cli.responders.moreUserInfo(str);
});

e.on('list checks', function(str) {
  cli.responders.listChecks(str);
});

e.on('more check info', function(str) {
  cli.responders.moreCheckInfo(str);
});

e.on('list logs', function(str) {
  cli.responders.listLogs();
});

e.on('more log info', function(str) {
  cli.responders.moreLogInfo(str);
});

// Responders
cli.responders = {};

// Help / Man
cli.responders.help = function() {
  var commands = {
    'man': 'Show this help page',
    'help': 'Alias of the "man" command',
    'exit': 'Kill CLI(and rest of app)',
    'stats': 'Get statistics on the underlying operating system and resource utilization',
    'list users': 'show list of registered (undeleted users) in system',
    'more user info --{userId}': 'Show details of specified user',
    'list checks --up --down': 'Show a list of all active checks in system, including their state. The "--up" and "--down" flags are both optional',
    'more check info --{checkId}': 'Show details of a specified check',
    'list logs': 'Show a list of all log files available to be read (compressed only)',
    'more log info --{fileName}': 'Show details of a specified log file'
  };
  // Show a header for help page that is as wide as screen
  cli.horizantalLine();
  cli.centered('CLI Manual');
  cli.horizantalLine();
  cli.verticalSpace(2);
  // Show each command, followed by explaination in white and yellow respectively
  for(var key in commands){
    if(commands.hasOwnProperty(key)){
      var value = commands[key];
      var line = "\x1b[33m"+key+"\x1b[0m";
      var padding = 60 - line.length;
      for(i = 0;i < padding; i++){
        line+=' ';
      }
      line+=value;
      console.log(line);
      cli.verticalSpace();
    }
  }
  cli.verticalSpace(1);
  cli.horizantalLine();
};

cli.verticalSpace = function(lines){
  lines = typeof(lines) == 'number' && lines > 0 ? lines : 1;
  for(i=0;i < lines; i++){
    console.log('');
  }
};

cli.horizantalLine = function(){
  // Get available screen size
  var width = process.stdout.columns;
  var line = '';
  for(i = 0;i<width;i++){
    line += '-';
  }
  console.log(line);
}

cli.centered = function(str){
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : '';
  // Get available screen size
  var width = process.stdout.columns;
  // Calculate left padding
  var leftPadding = Math.floor((width - str.length)/2);
  // Put in left padded spaces before string itself
  var line = '';
  for(i = 0;i<leftPadding;i++){
    line += ' ';
  }
  line+=str;
  console.log(line);
}

cli.responders.exit = function() {
  process.exit(0);
};

cli.responders.stats = function() {
  // compile an object of stats
  var stats = {
    'Load Average': os.loadavg().join(' '),
    'CPU Count': os.cpus().length,
    'Free Memory': os.freemem(),
    'Current Malloced Memory': v8.getHeapStatistics().malloced_memory,
    'Peak Malloced Memory': v8.getHeapStatistics().peak_malloced_memory,
    'Allocated Heap Used(%)': ((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
    'Available Heap Allocated(%)': ((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
    'Uptime': os.uptime()+' seconds'
  }
  cli.horizantalLine();
  cli.centered('SYSTEM STATISTICS');
  cli.horizantalLine();
  cli.verticalSpace(2);
  for(var key in stats){
    if(stats.hasOwnProperty(key)){
      var value = stats[key];
      var line = "\x1b[33m"+key+"\x1b[0m";
      var padding = 60 - line.length;
      for(i = 0;i < padding; i++){
        line+=' ';
      }
      line+=value;
      console.log(line);
      cli.verticalSpace();
    }
  }
  cli.verticalSpace(1);
  cli.horizantalLine();
};

cli.responders.listUsers = function() {
  _data.list('users', function(err, userIds){
    if(!err && userIds && userIds.length > 0){
      cli.verticalSpace();
      userIds.forEach(function(userId){
        _data.read('users', userId, function(err, userData){
          if(!err && userData){
            var line = 'Name: ' +userData.firstName+' '+userData.lastName+' Phone: '+userData.phone+' Checks:';
            var numberOfChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array && userData.checks.length > 0 ? userData.checks.length : 0;
            line+=numberOfChecks;
            console.log(line);
            cli.verticalSpace();
          }
        })
      });
    }
  });
};

cli.responders.moreUserInfo = function(str) {
  // Get ID from str
  var arr = str.split('--');
  var userId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
  if(userId){
    // Lookup user
    _data.read('users',userId, function(err, userData){
      if(!err && userData){
        // Remove hashedPassword
        delete userData.hashedPassword;
        // Print JSON with text highlighting
        cli.verticalSpace();
        console.dir(userData, {'colors': true});
        cli.verticalSpace();
      }
    });
  }
}

cli.responders.listChecks = function(str) {
  _data.list('checks', function(err, checkIds){
    if(!err && checkIds && checkIds.length > 0){
      cli.verticalSpace();
      checkIds.forEach(function(checkId){
        _data.read('checks', checkId, function(err, checkData){
          var includeCheck = false;
          var lowerString = str.toLowerCase();
          // Get state, default to down
          var state = typeof(checkData.state) == 'string' ? checkData.state : 'down';
          // Get state, default to unknown
          var stateOrUnknown = typeof(checkData.state) == 'string' ? checkData.state : 'unknown';
          // If user has specified state, or hasnt specified any state, include current check accordingly
          if(lowerString.indexOf('--'+state) > -1 || (lowerString.indexOf('--down') == -1 && lowerString.indexOf('--up') == -1)){
            var line = 'ID: '+checkData.id+' '+checkData.method.toUpperCase()+' '+checkData.protocol+'://'+checkData.url+' State:'+stateOrUnknown;
            console.log(line);
            cli.verticalSpace();
          }
        })
      })
    }
  })
};

cli.responders.moreCheckInfo = function(str) {
  // Get ID from str
  var arr = str.split('--');
  var checkId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
  if(checkId){
    // Lookup check
    _data.read('checks',checkId, function(err, checkData){
      if(!err && checkData){
        // Print JSON with text highlighting
        cli.verticalSpace();
        console.dir(checkData, {'colors': true});
        cli.verticalSpace();
      }
    });
  }
}

cli.responders.listLogs = function() {
  // _logs.list(true, function(err, logFileNames){
  //   if(!err && logFileNames && logFileNames.length > 0){
  //     cli.verticalSpace();
  //     logFileNames.forEach(function(logFileName){
  //       if(logFileName.indexOf('-') > -1){
  //         console.log(logFileName);
  //         cli.verticalSpace();
  //       }
  //     })
  //   }
  // });
  var ls = childProcess.spawn('ls', ['./.logs/']);
  ls.stdout.on('data', function(dataObj){
    // Explode into seperate line
    var dataStr = dataObj.toString();
    var logFileNames = dataStr.split('\n');
    cli.verticalSpace();
    logFileNames.forEach(function(logFileName){
      if(typeof(logFileName) === 'string' && logFileName.length > 0 && logFileName.indexOf('-') > -1){
        console.log(logFileName.trim().split('.')[0]);
        cli.verticalSpace();
      }
    });
  });
};

cli.responders.moreLogInfo = function(str) {
  // Get logFileName from str
  var arr = str.split('--');
  var logFileName = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
  if(logFileName){
    cli.verticalSpace();
    // Decompress log
    _logs.decompress(logFileName, function(err, strData) {
      if(!err && strData){
        // split into lines
        var arr = strData.split('\n');
        arr.forEach(function(jsonString){
          var logObject = helpers.parseJsonToObject(jsonString);
          if(logObject && JSON.stringify(logObject) !== '{}'){
            console.dir(logObject, {'colors': true});
            cli.verticalSpace();
          }
        });
      }
    });
  }
}

// input processor
cli.processInput = function(str){
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;
  // only process input if user entered something
  if(str){
    // Codify unique strings that identify unique questions allowed to be asked
    var uniqueInputs = [
      'man',
      'help',
      'exit',
      'stats',
      'list users',
      'more user info',
      'list checks',
      'more check info',
      'list logs',
      'more log info'
    ];
    // Go through possible inputs, emit an event if match notfound
    var matchFound = false;
    var counter = 0;
    uniqueInputs.some(function(input){
      if(str.toLowerCase().indexOf(input) > -1){
        matchFound = true;
        // emit an event matching unique input, and include the full string given by user
        e.emit(input, str);
        return true;
      }
    });
    // If no match found, tell user to try again
    if(!matchFound){
      console.log("sorry try again!");
    }
  }
}

// Init script
cli.init = function() {
  // Send start message to console, in dark blue
  debug('\x1b[34m%s\x1b[0m',"The CLI is running");
  //Start interface
  var _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>'
  });
  // create an initial prompt
  _interface.prompt();
  // Handle each line of input seperately
  _interface.on('line', function(str){
    // Send to input processor
    cli.processInput(str);
    // re-initialize the prompt afterwards
    _interface.prompt();
  });
  // If user stops CLI, kill associated tasks
  _interface.on('close',function(){
    process.exit(0);
  });

};




module.exports = cli;
