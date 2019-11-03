/*
* worker-related tasks
*
*/

// Dependencies
var path = require('path');
var http = require('http');
var https = require('https');
var fs = require('fs');
var _data = require('./data');
var helpers = require('./helpers');
var url = require('url');
var _logs = require('./logs');
var util = require('util');
var debug = util.debuglog('workers');

// Instantiate worker object

var workers = {};

// lookup all checks, get their data send to a validator
workers.gatherAllChecks = function(){
  _data.list('checks', function(err, checks){
    if(!err && checks && checks.length > 0){
      checks.forEach(function(check){
        // Read in the check data
        _data.read('checks', check, function(err, originalCheckData){
          if(!err && originalCheckData){
            // pass it to the check validator, and let that function continue or log errors as needed
            workers.validateCheckData(originalCheckData);
          } else {
            debug('Error reading one of the checks data');
          }
        });
      });
    } else {
      debug('Error: couldnt find any checks to process');
    }
  })
};

// sanity check the check-data
workers.validateCheckData = function(originalCheckData){
  originalCheckData = typeof(originalCheckData) == 'object' && originalCheckData !== null ? originalCheckData : {};
  originalCheckData.id = typeof(originalCheckData.id) == 'string' && originalCheckData.id.length == 20 ? originalCheckData.id : false;
  originalCheckData.userPhone = typeof(originalCheckData.userPhone) == 'string' && originalCheckData.userPhone.length == 10 ? originalCheckData.userPhone : false;
  originalCheckData.protocol = typeof(originalCheckData.protocol) == 'string' && ['https', 'http'].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol : false;
  originalCheckData.url = typeof(originalCheckData.url) == 'string' && originalCheckData.url.trim().length > 0 ? originalCheckData.url.trim() : false;
  originalCheckData.method = typeof(originalCheckData.method) == 'string' && ['post', 'put', 'get', 'delete'].indexOf(originalCheckData.method) > -1 ? originalCheckData.method : false;
  originalCheckData.successCodes = typeof(originalCheckData.successCodes) == 'object' && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0 ? originalCheckData.successCodes : false;
  originalCheckData.timeoutSeconds = typeof(originalCheckData.timeoutSeconds) == 'number' && originalCheckData.timeoutSeconds % 1 == 0 && originalCheckData.timeoutSeconds > 0 && originalCheckData.timeoutSeconds <= 5 ? originalCheckData.timeoutSeconds : false;
  // set the keys that may not be set (if the worker havent seen this check earlier)
  originalCheckData.state = typeof(originalCheckData.state) == 'string' && ['up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down';
  originalCheckData.lastChecked = typeof(originalCheckData.lastChecked) == 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false;
  // If all checks pass, pass the data along to next step in process
  if(originalCheckData.id &&
  originalCheckData.userPhone &&
  originalCheckData.protocol &&
  originalCheckData.url &&
  originalCheckData.method &&
  originalCheckData.successCodes &&
  originalCheckData.timeoutSeconds){
    workers.performCheck(originalCheckData);
  } else {
    debug('Error: one of the checks  is not properly formatted.skipping it');
  }
};

// perform check, send the originalCheckData and the outcome of the check process, to the next step in the process
  workers.performCheck = function(originalCheckData) {
    // prepare the initial check outcome
    var checkOutcome = {
      'error': false,
      'responseCode': false
    };
    // Mark the outcome has not been sent yet
    var outcomeSent = false;

    // parse hostname and path out of the original check data
    var parsedUrl = url.parse(originalCheckData.protocol+'://'+originalCheckData.url, true);
    var hostname = parsedUrl.hostname;
    var path = parsedUrl.path; // using path instead of pathname becuase we want query string

    // Construct request
    var requestDetails = {
      'protocol': originalCheckData.protocol+':',
      'hostname': hostname,
      'method': originalCheckData.method.toUpperCase(),
      'path': path,
      'timeout': originalCheckData.timeoutSeconds * 1000,
    };

    // Instantiate request object(using either http or https module)
      var _moduleToUse = originalCheckData.protocol == 'http' ? http : https;
      var req = _moduleToUse.request(requestDetails, function(res){
        // Grab status of the sent request
        var status = res.statusCode;
        // update checkOutcome and pass data along
        checkOutcome.responseCode = status;
        if(!outcomeSent){
          workers.processCheckOutcome(originalCheckData, checkOutcome);
          outcomeSent = true;
        }
      });
    // Bind to error evnet so it doesnt get thrown
    req.on('event', function(e){
      // update checkOutcome and pass data along
      checkOutcome.error = {
        'error': true,
        'value': e
      };
      if(!outcomeSent){
        workers.processCheckOutcome(originalCheckData, checkOutcome);
        outcomeSent = true;
      }
    });
    // Bind to timeout event
    req.on('timeout', function(e){
      // update checkOutcome and pass data along
      checkOutcome.error = {
        'error': true,
        'value': 'timeout'
      };
      if(!outcomeSent){
        workers.processCheckOutcome(originalCheckData, checkOutcome);
        outcomeSent = true;
      }
    });
    // end request
    req.end();
  };

  // process check outcome and update check data as needed and trigger an alert if needed
  // special logic for accomodating a check that has never been tested before (dont alert on that one)
  workers.processCheckOutcome = function(originalCheckData, checkOutcome){
    // decide if check if considered up or down
    var state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode > -1) ? 'up': 'down';
    // decide if an alert if warranted
    var alertWarranted = originalCheckData.lastChecked && originalCheckData.state !== state ? true : false;
    // log outcome
    var timeOfCheck = Date.now();
    workers.log(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck);
    // update the check data
    var newCheckData = originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();
    // save updates
    _data.update('checks', newCheckData.id, newCheckData, function(err){
      if(!err){
        // Send the new check data to next phase in process if needed
        if(alertWarranted){
          workers.alertUserToStatusChange(newCheckData);
        }else {
          debug('check outcome hasnt changed, no alert needed');
        }
      } else {
        debug('Error trying to save updates to one of the check');
      }
    });
  };

  // alert user as a change to theri check  status
  workers.alertUserToStatusChange = function(newCheckData){
    var msg = 'Alert: Your check for '+newCheckData.method.toUpperCase()+' '+newCheckData.protocol+'://'+newCheckData.url+' is curently '+newCheckData.state;
    helpers.sendTwilioSms(newCheckData.userPhone, msg, function(err){
      if(!err){
        debug('Success: user was alerted to a status change in their check, via sms');
      } else {
        debug('Error: Couldnt sms alert who had a state change in their check');
      }
    });
  };

  workers.log = function(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck){
    // form the log data
    var logData = {
      'check': originalCheckData,
      'outcome': checkOutcome,
      'state': state,
      'alert': alertWarranted,
      'time': timeOfCheck
    };
    // convert data to string
    var logString = JSON.stringify(logData);
    // Determine the name of log file
    var logFileName = originalCheckData.id;
    // append logString to file
    _logs.append(logFileName, logString, function(err) {
      if(!err){
        debug('Logging to file succeded');
      } else {
        debug('Logging to file failed');
      }
    });
  };

// Timer to execute worker-process once per minute
workers.loop = function(){
    setInterval(function(){
      workers.gatherAllChecks();
    }, 1000 * 60);
};

// Rotate (compress) log files
workers.rotateLogs = function(){
  // List all (non compressed) log files
  _logs.list(false, function(err, logs){
    if(!err && logs && logs.length > 0){
        logs.forEach(logName => {
          // compress data to a different file
          var logId = logName.replace('.log','');
          var newFileId = logId+'-'+Date.now();
          _logs.compress(logId, newFileId,function(err){
            if(!err){
              // Truncate the log
              _logs.truncate(logId, function(err){
                if(!err){
                  debug('Success truncating log file');
                } else {
                  debug('Error truncating log file');
                }
              });
            } else {
              debug('Error compressing one of the log files', err);
            }
          })
        })
    } else {
      debug('Error: Couldnt find any logs to rotate');
    }
  });
};

// Timer to execute log-rotation process once-per-day
workers.logRotationLoop = function() {
  setInterval(function(){
    workers.rotateLogs();
  }, 1000*60*60*24);
};

workers.init = function(){
  // send to console in yellow
  console.log('\x1b[33m%s\x1b[0m','Background workers are running');
  // Execute all checks immediately
  workers.gatherAllChecks();
  // call loop so checks will execute later on
  workers.loop();
  // compress all the logs immediately
  workers.rotateLogs();
  // call the compression loop so logs will be compressed later on
  workers.logRotationLoop();
};

module.exports = workers;
