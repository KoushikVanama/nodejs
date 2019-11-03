/*
* Library for storing and editing data
*
*/

// Dependencies
var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');

// container for the module
var lib = {};

// Base directory of .data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// write data to a file
lib.create = function(dir, file, data, callback){
  // open the file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx', function(err, fileDescriptor){
    if(!err && fileDescriptor){
      console.log(fileDescriptor, "@#$");
      // convert data to string
      var stringData = JSON.stringify(data);

      // write to file and close interval
      fs.writeFile(fileDescriptor, stringData, function(err){
        if(!err){
          fs.close(fileDescriptor, function(err){
            if(!err){
              callback(false);
            } else {
              callback('Error closing new file');
            }
          })
        } else {
          callback('Error writing to new file');
        }
      })

    } else {
      callback('Couldnt create a new file, it may already exists');
    }
  })
}

// Read data from file
lib.read = function(dir, file, callback){
  fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf8', function(err, data){
    // var parsedData = JSON.parse(data);
    var parsedData = helpers.parseJsonToObject(data);
    callback(err, parsedData);
  });
};

// Update data inside a file
lib.update = function(dir, file, data, callback){
  // open the file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', function(err, fileDescriptor) {
    if(!err && fileDescriptor){
      // convert data to string
      var stringData = JSON.stringify(data);

      //Truncate the file
      fs.truncate(fileDescriptor,function(err){
        if(!err){
          // Write to the file and close it
          fs.writeFile(fileDescriptor, stringData, function(err){
            if(!err){
              fs.close(fileDescriptor,function(err){
                if(!err){
                  callback(false);
                } else {
                  callback('Error closing existing file');
                }
              });
            } else {
              callback('Error writing to existing file');
            }
          });
        } else {
          callback('Error truncating file');
        }
      });
    } else {
      callback('Couldnot open file for updataing, it may not exist yet');
    }
  });
};

// Delete a file
lib.delete = function(dir, file, callback){
  // Unlink the file
  fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err) {
    if(!err){
      callback(false);
    } else {
      callback('Error deleting file');
    }
  });
}

// List all files
lib.list = function(dir, callback){
  fs.readdir(lib.baseDir+dir+'/', function(err, data){
    if(!err && data && data.length > 0){
      var trimmedFileNames = [];
      data.forEach(function(fileName){
        trimmedFileNames.push(fileName.replace('.json', ''));
      });
      callback(false, trimmedFileNames);
    } else {
      callback(err, data);
    }
  });
};

module.exports = lib;
