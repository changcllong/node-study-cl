'use strict';

const fs = require('fs');

const files = {};

module.exports = function(fileName) {
  return new Promise((resolve, reject) => {
    fs.stat(fileName, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  }).then(stats => {
    const lastModify = stats.mtime.toUTCString();

    if (files[fileName] && lastModify === files[fileName].lastModify) {
      console.log('load file from cache!');
      return files[fileName].data;
    }

    return new Promise((resolve, reject) => {
      fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) {
          reject(err);

        } else {
          if (Buffer.isBuffer(data)) {
            data = data.toString();
          }
          const fileObj = { data };
          fileObj.lastModify = lastModify;
          files[fileName] = fileObj;
          resolve(data);
        }
      });
    });
  });
};
