/*
* Library for storing and rotating logs
*
*/

// Dependencies
var fs = require('fs');
var path = require('path');
var zlib = require('zlib');

// container for module
var lib = {};

// Base directory of logs folder
lib.baseDir = path.join(__dirname, '/../.logs/');

// append a string to file, create file if not exists
lib.append = function(file,str, callback){
  // open file for appending
  fs.open(lib.baseDir+file+'.log','a',function(err,fileDescriptor){
    if(!err && fileDescriptor){
      // append and close it
      fs.appendFile(fileDescriptor,str+'\n',function(err){
        if(!err){
          fs.close(fileDescriptor,function(err) {
            if(!err){
              callback(false);
            } else {
              callback('Error closing file that was being appended');
            }
          })
        }else {
          callback('Error appending to file')
        }
      });

    }else {
      callback('Couldnt open file for appending');
    }
  });
};

// List all logs and optionally include the compressed logs
lib.list = function(includeCompressedLogs, callback){
  fs.readdir(lib.baseDir,function(err,data){
    if(!err && data && data.length > 0){
      var trimmedFileNames = [];
      data.forEach(fileName => {
        // add .log files
        if(fileName.indexOf('.log') > -1){
          trimmedFileNames.push(fileName.replace('.log',''));
        }
        // Add on .gz files
        if(fileName.indexOf('.gz.b64') > -1 && includeCompressedLogs){
          trimmedFileNames.push(fileName.replace('.gz.b64',''));
        }
      });
      callback(false, trimmedFileNames);
    } else {
      callback(err,data);
    }
  });
};

//  compress contents of one .log file into a .gz.b64 file within same directory
lib.compress = function(logId,newFileId,callback){
  var sourceFile = logId+'.log';
  var destFile = newFileId+'.gz.b64';
  // Read source file
  fs.readFile(lib.baseDir+sourceFile,'utf8',function(err, inputString){
    if(!err && inputString){
      // compress data using gzip
      zlib.gzip(inputString,function(err, buffer){
        if(!err && buffer){
          // Send data to destination file
          fs.open(lib.baseDir+destFile,'wx',function(err, fileDescriptor){
            if(!err && fileDescriptor){
              // write to destination file
              fs.writeFile(fileDescriptor, buffer.toString('base64'),function(err){
                if(!err){
                  // close the destination file
                  fs.close(fileDescriptor, function(err){
                    if(!err){
                      callback(false);
                    } else {
                      callback(err);
                    }
                  });
                } else {
                  callback(err);
                }
              });
            } else {
              callback(err);
            }
          });
        } else {
          callback(err);
        }
      })
    } else {
      callback(err);
    }
  });
};

// Decompress contents of a .gz.b64 file into a string variable
lib.decompress = function(fileId, callback){
  var fileName = fileId+'.gz.b64';
  fs.readFile(lib.baseDir+fileName,'utf8',function(err, str) {
    if(!err && str){
      // Decompress the data
      var inputBuffer = Buffer.from(str,'base64');
      zlib.unzip(inputBuffer,function(err,outputBuffer){
        if(!err && outputBuffer){
          // callback
          var str = outputBuffer.toString();
          callback(false, str);
        } else {
          callback(err);
        }
      })
    } else {
      callback(err);
    }
  });
};

// Truncate a log file
lib.truncate = function(logId,callback){
  fs.truncate(lib.baseDir+logId+'.log',0,function(err){
    if(!err){
      callback(false);
    } else {
      callback(err);
    }
  });
};

module.exports = lib;
