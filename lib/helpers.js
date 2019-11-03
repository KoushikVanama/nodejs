/*
* Helpers for various tasks
*
*/

// Dependencies
var crypto = require('crypto');
var config = require('./config');
var https = require('https');
var querystring = require('querystring');
var path = require('path');
var fs = require('fs');

// Container for all helpers
var helpers = {};

// Sample for testing that simply returns a number
helpers.getANumber = function() {
  return 1;
};

// Create a SHA256 hash
helpers.hash = function(pwd){
  if(typeof(pwd) == 'string' && pwd.length > 0){
    var hash = crypto.createHmac('sha256', config.hashingSecret).update(pwd).digest('hex');
    return hash;
  } else {
    return false;
  }
};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str){
  try{
    var obj = JSON.parse(str);
    return obj;
  }catch(e){
    return {};
  }
};

// create a string of random alphanumeric characters of a given length
helpers.createRandomString = function(strLength){
  var strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
  if(strLength){
    // Define all the possible characters that could go into a string
    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    // Start the final string
    var str = '';
    for(i=1;i<=strLength;i++){
      // Get a random character from the possibleCharacters stringify
      var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
      // append this character to the final string
      str += randomCharacter;
    }
    return str;
  } else {
    return false;
  }
}

// send an SMS message via Twilio
helpers.sendTwilioSms = function(phone, msg, callback){
  // Validate parameters
  phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone : false;
  msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length < 1600 ? msg.trim() : false;
  if(phone && msg){
    // configure the request payload
    var payload = {
      'From': config.twilio.fromPhone,
      'To': '+91'+phone,
      'Body': msg
    };
    // Stringify the payload
    var stringPayload = querystring.stringify(payload);

    // Configure the request details
    var requestDetails = {
        'protocol': 'https:',
        'hostname': 'api.twilio.com',
        'method': 'POST',
        'path': '/2010-04-01/Accounts/'+config.twilio.accountSid+'/Messages.json',
        'auth': config.twilio.accountSid+':'+config.twilio.authToken,
        'headers': {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(stringPayload)
        }
    };
    // Instantiate the request object
    var req = https.request(requestDetails, function(res){
      // Grab status
      var status = res.statusCode;
      // callback successfully if request went through
      if(status == 200 || status == 201){
        callback(false);
      }else {
        callback('statusCode returned was', status)
      }
    });
    // Bind to error event so it doesnt get thrown
    req.on('error', function(e) {
      callback(e);
    });
    // Add payload
    req.write(stringPayload);
    // end request
    req.end();
  } else {
    callback('Given parameters are missing/invalid');
  }
};

// Get the string content of a template
helpers.getTemplate = function(templateName, data, callback){
  templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;
  data = typeof(data) == 'object' && data !== null ? data : {};

  if(templateName){
    var templatesDir = path.join(__dirname,'/../templates/');
    fs.readFile(templatesDir+templateName+'.html','utf8',function(err,str){
      if(!err && str && str.length > 0){
        // Do interpolation on string
        var finalString = helpers.interpolate(str, data);
        callback(false, finalString);
      } else {
        callback('No template could be found');
      }
    });
  } else {
    callback('A valid template name was not specified');
  }
};

// Add universal header and footer to string and pass provided data object to the header and footer for interpolation
helpers.addUniversalTemplates = function(str, data, callback){
  str = typeof(str) == 'string' && str.length > 0 ? str : '';
  data = typeof(data) == 'object' && data !== null ? data : {};
  // Get header
  helpers.getTemplate('_header', data, function(err, headerString) {
    if(!err && headerString){
      // Get footer
      helpers.getTemplate('_footer', data, function(err, footerString){
        if(!err && footerString){
          // Add them all together
          var fullString = headerString+str+footerString;
          callback(false, fullString);
        } else {
          callback('Couldnt find footer template');
        }
      });
    } else {
      callback('Couldnt find the header template');
    }
  });
}


// Take given string and data object and find/replace all keys within it
helpers.interpolate = function(str, data){
  str = typeof(str) == 'string' && str.length > 0 ? str : '';
  data = typeof(data) == 'object' && data !== null ? data : {};
  // Add the templateGlobals do the data object, prepending their key name with 'global'
  for(var keyName in config.templateGlobals){
    if(config.templateGlobals.hasOwnProperty(keyName)){
      data['global.'+keyName] = config.templateGlobals[keyName];
    }
  }
  // for each key inthe data object, insert its value into the string at the corresponding placeholder
  for(var key in data){
    if(data.hasOwnProperty(key) && typeof(data[key]) == 'string'){
      var replace = data[key];
      var find = '{'+key+'}';
      str = str.replace(find,replace);
    }
  }
  return str;
};

// Get the contents of a static(public) asset
helpers.getStaticAsset = function(fileName, callback) {
  fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false;
  if(fileName){
    var publicDir = path.join(__dirname, '/../public/');
    fs.readFile(publicDir+fileName,function(err,data){
      if(!err && data){
        callback(false,data);
      } else {
        callback('No file could be found');
      }
    });
  } else {
    callback('A valid file name was not specified');
  }
};

module.exports = helpers;
