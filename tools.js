var fs = require('fs');
var mkdirp = require('mkdirp');

function writeFileAsync(filePath, content) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(filePath, content, function(err) {
        if(err) {
            reject(err);
        } else {
          resolve(filePath);
        }
    });

  });
}

function mkdirpPromise(path) {
  return new Promise(function(resolve, reject) {
    mkdirp(path, function (err) {
        if (err) reject(err)
        else resolve(path);
    });
  })
}

module.exports = { 
  writeFileAsync, 
  mkdirpPromise 
}