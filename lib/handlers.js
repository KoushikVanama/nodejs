/*
* Request handlers
*
*/

// Dependencies
var _data = require('./data');
var helpers = require('./helpers');
var config = require('./config');
var _url = require('url');
var dns = require('dns');
var _performance = require('perf_hooks').performance;
var util = require('util');
var debug = util.debuglog('performance');

// Define handlers
var handlers = {};

/*
* HTML handlers
*
*/
// Index handler
handlers.index = function(data, callback){
  // Reject any that request that isnt a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Uptime Monitoring - Made simple',
      'head.description': 'We offer free, simple uptime Monitoring for HTTP/HTTPS sites of all kinds. when your site goes down, we will send you a text to let you know',
      'body.class': 'index'
    };

    // Read in index template as a string
    helpers.getTemplate('index', templateData, function(err, str){
      if(!err && str){
        // add universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str){
          if(!err && str){
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// create Account handler
handlers.accountCreate = function(data, callback){
  // Reject any that request that isnt a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Create an Account',
      'head.description': 'Signup is easy and only takes few seconds',
      'body.class': 'accountCreate'
    };

    // Read in template as a string
    helpers.getTemplate('accountCreate', templateData, function(err, str){
      if(!err && str){
        // add universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str){
          if(!err && str){
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// create new session
handlers.sessionCreate = function(data, callback){
  // Reject any that request that isnt a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Login to your Account',
      'head.description': 'Please enter your phone number and password to access your account',
      'body.class': 'sessionCreate'
    };

    // Read in template as a string
    helpers.getTemplate('sessionCreate', templateData, function(err, str){
      if(!err && str){
        // add universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str){
          if(!err && str){
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// session has been deleted
handlers.sessionDeleted = function(data, callback){
  // Reject any that request that isnt a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Logged out',
      'head.description': 'You have been logged out',
      'body.class': 'sessionDeleted'
    };

    // Read in template as a string
    helpers.getTemplate('sessionDeleted', templateData, function(err, str){
      if(!err && str){
        // add universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str){
          if(!err && str){
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Edit your account
handlers.accountEdit = function(data, callback){
  // Reject any that request that isnt a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Account Settings',
      'body.class': 'accountEdit'
    };

    // Read in template as a string
    helpers.getTemplate('accountEdit', templateData, function(err, str){
      if(!err && str){
        // add universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str){
          if(!err && str){
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Account has been deleted
handlers.accountDeleted = function(data, callback){
  // Reject any that request that isnt a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Account Deleted',
      'head.description': 'Your account has been deleted',
      'body.class': 'accountDeleted'
    };

    // Read in template as a string
    helpers.getTemplate('accountDeleted', templateData, function(err, str){
      if(!err && str){
        // add universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str){
          if(!err && str){
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Create a new check
handlers.checksCreate = function(data, callback){
  // Reject any that request that isnt a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Create a new check',
      'body.class': 'checksCreate'
    };

    // Read in template as a string
    helpers.getTemplate('checksCreate', templateData, function(err, str){
      if(!err && str){
        // add universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str){
          if(!err && str){
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Dashboard(view all checks)
handlers.checksList = function(data, callback){
  // Reject any that request that isnt a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Dashboard',
      'body.class': 'checksList'
    };

    // Read in template as a string
    helpers.getTemplate('checksList', templateData, function(err, str){
      if(!err && str){
        // add universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str){
          if(!err && str){
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Edit a check
handlers.checksEdit = function(data, callback){
  // Reject any that request that isnt a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Check Details',
      'body.class': 'checksEdit'
    };

    // Read in template as a string
    helpers.getTemplate('checksEdit', templateData, function(err, str){
      if(!err && str){
        // add universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str){
          if(!err && str){
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// favicon
handlers.favicon = function(data, callback){
  // reject any request that isnt a GET
  if(data.method == 'get'){
    // Read in the favicon's data
    helpers.getStaticAsset('favicon.ico', function(err, data){
      if(!err && data){
        // callback the data
        callback(200, data, 'favicon');
      } else {
        callback(500);
      }
    });
  } else {
    callback(405);
  }
};

// public assests
handlers.public = function(data, callback){
  // reject any request that isnt a GET
  if(data.method == 'get'){
    // Get the filename being requested
    var trimmedAssetName = data.trimmedPath.replace('public/','').trim();
    if(trimmedAssetName.length > 0){
      // Read in the assets data
      helpers.getStaticAsset(trimmedAssetName,function(err, data){
        if(!err && data){
          // Determine the content type(default to plain text)
          var contentType = 'plain';
          if(trimmedAssetName.indexOf('.css') > -1){
            contentType = 'css';
          }
          if(trimmedAssetName.indexOf('.png') > -1){
            contentType = 'png';
          }
          if(trimmedAssetName.indexOf('.jpg') > -1){
            contentType = 'jpg';
          }
          if(trimmedAssetName.indexOf('.ico') > -1){
            contentType = 'favicon';
          }
          callback(200, data, contentType);
        } else {
          callback(404);
        }
      });
    } else {
      callback(404);
    }
  } else {
    callback(405);
  }
};

/*
* JSON API handlers
*
*/

// sample handler
handlers.sample = function(data,callback) {
  callback(200, {'name': 'sample route triggered'});
};

handlers.ping = function(data, callback){
  callback(200);
}

handlers.exampleError = function(data, callback){
  var err = new Error('This is an example error');
  throw(err);
};

handlers.users = function(data, callback){
  var acceptableMethods = ['post', 'get', 'put', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

// container for the users submethods
handlers._users = {};

//Required data: firstname, lastname, phone, password, tosAgreement
//Optional data: none
handlers._users.post = function(data,callback){
  // Check that all required fields are filled out
  var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
  if(firstName && lastName && phone && password && tosAgreement){

    // Make sure user doesnt already exists
    _data.read('users', phone, function(err, data) {
      if(err){
        // Hash the password
        var hashedPassword = helpers.hash(password);

        // Create the user object
        if(hashedPassword){
          var userObject = {
            'firstName': firstName,
            'lastName': lastName,
            'phone': phone,
            'hashedPassword': hashedPassword,
            'tosAgreement': true
          };

          // Store the user
          _data.create('users', phone, userObject, function(err){
            if(!err){
              callback(200);
            }else {
              console.log(err);
              callback(500, {'Error': 'Couldnot create the new user'});
            }
          });
        } else {
          callback(500, {'Error': 'Couldnot hash the user\'s password'});
        }
      } else{
        // User already exists
        callback(400, {'Error': 'User Exists with the same phone number'});
      }
    });
  } else {
    callback(400, {'Error': 'Missing required fields'});
  }
};

// Required data: phone
// optional data: none
// @TODO Only let authenticated user access their object. Dont let them access anyone else'switch - fulfilled
handlers._users.get = function(data,callback){
  // Check phone number provided is valid
  var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
  if(phone){
    // Get the token from headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    // verify token given from headers is valid for the phone number
    handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
      if(tokenIsValid){
        // Look up the user
        _data.read('users', phone, function(err, data){
          if(!err && data){
            // Remove the hashedPassword from the user object before returning it
            delete data.hashedPassword;
            callback(200, data);
          } else {
            callback(404);
          }
        });
      }else {
        callback(403, {'Error':'Missing required token in header or token is invalid'});
      }
    });
  } else {
    callback(400, {'Error': 'Missing required field'},'json');
  }
};

// Required data: phone
// Optional data: firstName, lastName, phone(atleast one should be speicified)
// @TODO only let an authenticated user update their object. Dont let them access other user's - fulfilled
handlers._users.put = function(data,callback){
  // Check phone number provided is valid
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  // check for the optional fields
  var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  // Error if phone is invalid
  if(phone){
    // Error if nothing is sent to update
    if(firstName || lastName || password){
      // Get the token from headers
      var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
      // verify token given from headers is valid for the phone number
      handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
        if(tokenIsValid){
          // Look up the user
          _data.read('users', phone, function(err, userData){
            if(!err && userData){
              // Update the fields necessary
              if(firstName){
                userData.firstName = firstName;
              }
              if(lastName){
                userData.lastName = lastName;
              }
              if(password){
                userData.hashedPassword = helpers.hash(password);
              }
              // Store the new updates
              _data.update('users', phone, userData, function(err){
                if(!err){
                  callback(200);
                }else {
                  console.log(err);
                  callback(500, {'Error': 'Couldnt update the user'});
                }
              })
            }else {
              callback(400, {'Error': 'The speicified user doesnt exists'});
            }
          });
        } else{
        callback(403, {'Error':'Missing required token in header or token is invalid'});
      }
    });
  }else {
    callback(400, {'Error': 'Missing required fields'});
  }
}
};

// Require fields: phone
// @TODO only let an authenticated user delete object. Dont let them delete anyone else's - fulfilled
// @TODO cleanup(delete) any other files associated with the user - fulfilled
handlers._users.delete = function(data,callback){
  // Check phone number provided is valid
  var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
  if(phone){
    // Get the token from headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    // verify token given from headers is valid for the phone number
    handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
      if(tokenIsValid){
        // Look up the user
        _data.read('users', phone, function(err, userData){
          if(!err && userData){
            _data.delete('users', phone, function(err){
              if(!err){
                // callback(200);
                // Delete checks associated with the user
                var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                var checksToDelete = userChecks.length;
                if(checksToDelete > 0){
                  var checksDeleted = 0;
                  var deletionErrors = false;
                  // loop checks
                  userChecks.forEach(checkId => {
                    _data.delete('checks', checkId, function(err) {
                      if(err){
                        deletionErrors = true;
                      }
                      checksDeleted++;
                      if(checksDeleted == checksToDelete){
                        if(!deletionErrors){
                          callback(200);
                        } else{
                          callback(500, {'Error':'Errors encountered while attempting to delelte users check. All checks may not be deleted successfully'});
                        }
                      }
                    })
                  });
                } else {
                  callback(200);
                }
              }else {
                callback(500, {'Error': 'Couldnt delete the specified user'});
              }
            })
          } else {
            callback(400, {'Error': 'Couldnt find specified user'});
          }
        });
      }else {
        callback(403, {'Error':'Missing required token in header or token is invalid'});
      }
    });
  } else {
    callback(400, {'Error': 'Missing required field'});
  }
};

// Tokens
handlers.tokens = function(data, callback){
  var acceptableMethods = ['post', 'get', 'put', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._tokens[data.method](data, callback);
  } else {
    callback(405);
  }
};

// container for all token methods
handlers._tokens = {};

// Required data: phone, password
// optional data: none
handlers._tokens.post = function(data, callback){
  _performance.mark('entered function');
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  _performance.mark('inputs validated');
  if(phone && password){
    // lookup the user who matches that phone number
    _performance.mark('begining user lookup');
    _data.read('users', phone, function(err, userData){
      _performance.mark('user lookup complete');
      if(!err, userData){
        // Hash and compare it with the one in stored userobject
        _performance.mark('begining password hashing');
        var hashedPassword = helpers.hash(password);
        _performance.mark('password hashing completed');
        if(hashedPassword === userData.hashedPassword){
          // if valid create a new token with a random name. set expiration 1 hour in the future
          _performance.mark('creating data for token');
          var tokenId = helpers.createRandomString(20);
          var expires = Date.now() + 1000 * 60 * 60;
          var tokenObject = {
            'phone': phone,
            'id': tokenId,
            'expires': expires
          };
          //store the tokens
          _performance.mark('begining storing token');
          _data.create('tokens', tokenId, tokenObject, function(err){
            _performance.mark('storing token complete');
            // Gather all measurements
            _performance.measure('begining to end', 'entered function', 'storing token complete');
            _performance.measure('validating user input', 'entered function', 'inputs validated');
            _performance.measure('user lookup', 'begining user lookup', 'user lookup complete');
            _performance.measure('password hashing', 'begining password hashing', 'password hashing completed');
            _performance.measure('token data creation', 'creating data for token', 'begining storing token');
            _performance.measure('token storing', 'begining storing token', 'storing token complete');
            // Log out all measurements
            var measurements = _performance.getEntriesByType('measure');
            measurements.forEach(function(measurement){
              debug('\x1b[33m%s\x1b[0m', measurement.name + ' ' + measurement.duration);
            });
            if(!err){
              callback(200, tokenObject);
            }else {
              callback(500, {'Error': 'Couldnt create a new token'});
            }
          })
        }else {
          callback(400, {'Error': 'password doesnt match with speicfied users stored password'});
        }

      } else {
        callback(400, {'Error': 'Couldnot find the specified user'});
      }
    })
  }else {
    callback(400, {'Error': 'Missing required fields'});
  }
};

// Required data: id
// optional data: none
handlers._tokens.get = function(data, callback){
  // Check id is valid
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id){
    // Look up the user
    _data.read('tokens', id, function(err, tokenData){
      if(!err && tokenData){
        callback(200, tokenData);
      } else {
        callback(404);
      }
    })
  } else {
    callback(400, {'Error': 'Missing required field'});
  }
};

// Required data: id, extend
// Optional data: none
handlers._tokens.put = function(data, callback){
  var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
  var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
  if(id && extend){
    // lookup the token
    _data.read('tokens', id, function(err, tokenData) {
      if(!err && tokenData){
        // check to make sure the token isnt already expired
        if(tokenData.expires > Date.now()){
          // set expiration an hour from now
          tokenData.expires = Date.now() + 1000 * 60 *60;
          //store new updates
          _data.update('tokens', id, tokenData, function(err){
            if(!err){
              callback(200);
            } else{
              callback(500, {'Error': 'Couldnt update tokens expiration'});
            }
          })
        }else{
          callback(400, {'Error': 'Token has already expired and cant be extended'});
        }
      }else {
        callback(400, {'Error': 'specified token doesnt exists'});
      }
    })
  }else {
    callback(400, {'Error': 'Missing required fields/invalid'});
  }
};

// required data: id
// optional data: none
handlers._tokens.delete = function(data, callback){
  // Check token provided is valid
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id){
    // Look up the user
    _data.read('tokens', id, function(err, data){
      if(!err && data){
        _data.delete('tokens', id, function(err,data){
          if(!err){
            callback(200);
          }else {
            callback(500, {'Error': 'Couldnt delete the specified token'});
          }
        })
      } else {
        callback(400, {'Error': 'Couldnt find specified token'});
      }
    });
  } else {
    callback(400, {'Error': 'Missing required field'});
  }
};

handlers._tokens.verifyToken = function(id, phone, callback){
  // lookup the token
  _data.read('tokens', id, function(err, tokenData){
    if(!err && tokenData){
      // check that the token is for the given user and not expired
      if(phone === tokenData.phone && tokenData.expires > Date.now()){
        callback(true);
      }else {
        callback(false);
      }
    } else {
      callback(false);
    }
  })
}

handlers.checks = function(data, callback){
  var acceptableMethods = ['post', 'get', 'put', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._checks[data.method](data, callback);
  } else {
    callback(405);
  }
};

// container for the users submethods
handlers._checks = {};

// Required data: protocol, url, method, successCodes, timeoutSeconds
// Optional data: none
handlers._checks.post = function(data, callback){
  // validate inputs
  var protocol = typeof(data.payload.protocol) == 'string' && ['http', 'https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
  var url = typeof(data.payload.url) == 'string' && data.payload.url.length > 1 ? data.payload.url : false;
  var method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1  ? data.payload.method : false;
  var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
  var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >=1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;
  if(protocol && url && method && successCodes && timeoutSeconds){
    // Get the token from headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    // Look up user by reading token
    _data.read('tokens', token, function(err, tokenData){
      if(!err && tokenData){
        var userPhone = tokenData.phone;
        // look up the user
        _data.read('users', userPhone, function(err, userData){
          if(!err && userData){
            var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
            //  verify if user has less than predefined max-checks-per-user
            if(userChecks.length < config.maxChecks){
              //verify that URL given has DNS entries(therefore can resolve)
              var parsedUrl = _url.parse(protocol+'://'+url, true);
              var hostName = typeof(parsedUrl.hostname) == 'string' && parsedUrl.hostname.length > 0 ? parsedUrl.hostname : false;
              dns.resolve(hostName, function(err, records){
                if(!err && records){
                  console.log(records, "@#$@#$@#######"); // records getting as ip address for the hostname(url entered)
                  // Generate a random checkId
                  var checkId = helpers.createRandomString(20);
                  // create a check object, and include the users phone
                  var checkObj = {
                    'id': checkId,
                    'userPhone': userPhone,
                    'protocol': protocol,
                    'url': url,
                    'method': method,
                    'successCodes': successCodes,
                    'timeoutSeconds': timeoutSeconds
                  }
                  // save the object in checks
                  _data.create('checks', checkId, checkObj, function(err){
                    if(!err){
                      // add the checkId to users object
                      userData.checks = userChecks;
                      userData.checks.push(checkId);
                      // save the new userData
                      _data.update('users', userPhone, userData, function(err){
                        if(!err){
                          // return the data about the new check
                          callback(200, checkObj);
                        } else {
                          callback(500, {'Error': 'Couldnt update the user with new check'});
                        }
                      })
                    } else {
                      callback(500, {'Error': 'Couldnt create new check'});
                    }
                  });
                } else {
                  callback(400, {'Error': 'The hostname of url entered didnt resolved any DNS entries'});
                }
              });
            } else {
                callback(400, {'Error': 'User already has maximum checks ('+config.maxChecks+')'});
            }
          } else {
            callback(403, {'Error': 'Some problem in fetching user'});
          }
        })
      } else {
        callback(403, {'Error': 'some problem in fetching token'});
      }
    });
  } else {
    callback(400, {'Error': 'Missing required fields/ Inputs are invalid'})
  }
}

// Required data: id
// Optional data: none
handlers._checks.get = function(data, callback){
  // Check id is valid
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id){
    //lookup the check
    _data.read('checks', id, function(err, checkData){
      if(!err && checkData){
        // Get the token from headers
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        // verify token given from headers is valid and belongs to user who created the check
        handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
          if(tokenIsValid){
            // return the check data
            callback(200, checkData);
          }else {
            callback(403);
          }
        });
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, {'Error': 'Missing required field'});
  }
};

// Required data: id
// optional data: protocol, url, method, successCodes, timeoutSeconds(one must)
handlers._checks.put = function(data, callback){
  var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
  // check for the optional fields
  var protocol = typeof(data.payload.protocol) == 'string' && ['http', 'https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
  var url = typeof(data.payload.url) == 'string' && data.payload.url.length > 1 ? data.payload.url : false;
  var method = typeof(data.payload.method) == 'string' && ['post', 'get', 'update', 'delete'].indexOf(data.payload.method) > -1  ? data.payload.method : false;
  var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
  var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >=1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;
  // check to make sure id is validate
  if(id){
    // check to make sure one or more optional fields has been sent
    if(protocol || url || method || successCodes || timeoutSeconds){
      // Lookup check
      _data.read('checks', id, function(err, checkData){
        if(!err && checkData){
          // Get the token from headers
          var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
          // verify token given from headers is valid and belongs to user who created the check
          handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
            if(tokenIsValid){
              // Update check where necessary
              if(protocol){
                checkData.protocol = protocol;
              }
              if(url){
                checkData.url = url;
              }
              if(method){
                checkData.method = method;
              }
              if(successCodes){
                checkData.successCodes = successCodes;
              }
              if(timeoutSeconds){
                checkData.timeoutSeconds = timeoutSeconds;
              }
              //store the new updates
              _data.update('checks', id, checkData, function(err){
                if(!err){
                  callback(200);
                }else {
                  callback(500, {'Error': 'Couldnt update the check'});
                }
              })
            }else {
              callback(403);
            }
          });
        } else {
          callback(400, {'Error': 'check id doesnt exists'});
        }
      })
    } else {
      callback(400, {'Error': 'Missing fields to update'});
    }
  }else {
    callback(400, {'Error': 'Missing required field'});
  }
}

// Required data: id
// optional data: none
handlers._checks.delete = function(data, callback) {
  // Check checkId is valid
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id){
    _data.read('checks', id, function(err, checkData){
      if(!err && checkData){
        // Get the token from headers
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        // verify token given from headers is valid and belongs to user who created the check
        handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
          if(tokenIsValid){
            _data.delete('checks', id, function(err){
              if(!err){
                console.log('console1');
                _data.read('users', checkData.userPhone, function(err, userData){
                  if(!err && userData){
                    console.log('console2', userData);
                    let tempObj = userData.checks.filter(item => item !== id);
                    userData.checks = tempObj;
                    console.log('console3', userData);
                    _data.update('users',checkData.userPhone, userData, function(err) {
                      if(!err){
                        callback(200);
                      }else {
                        callback(500, {'Error': 'Couldnt update user with the given check'});
                      }
                    })
                  } else {
                    callback(400, {'Error': 'Couldnt fetch user for given check'});
                  }
                })
              } else {
                callback(400, {'Error': 'Couldnt delete the check'});
              }
            });
          } else{
            callback(403);
          }
        });
      } else {
        callback(404, {'Error': 'Couldnt fetch matching check obj'});
      }
    });
  }else {
    callback(400, {'Error': 'Missing required field'});
  }
};

handlers.notFound = function(data,callback) {
  callback(404);
};

module.exports = handlers;
