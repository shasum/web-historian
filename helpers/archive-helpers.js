var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpHelpers = require('../web/http-helpers');
var request = require('http-request');


/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = readListOfUrls = function(callback){
  // read file asynchronously, then pass data to isUrlInList (callback)
  fs.readFile(paths.list, 'utf8', function(err, data) {
    if (err) {
      throw err;
    } else {
      callback(data.split('\n'));
    }
  });
}; // read sites.txt

exports.isUrlInList = function(url, callback){
  readListOfUrls(function(list) {
    callback(_.contains(list, url));
  });
};

exports.addUrlToList = function(url, callback){
  fs.appendFile(paths.list, url+'\n', 'utf8', function(err) {
    if (err) {
      throw err;
    } else {
      callback();
    }
  });
}; // add url to sites.txt

exports.isUrlArchived = function(url, callback){
  // console.log('Entered isUrlArchived', url);
  fs.exists(paths.archivedSites + url, function(exists){
    callback(exists);
  });
}; // if url is in /sites folder

exports.downloadUrls = function(urlList){
  urlList.forEach(function(url){
    var fullUrl = 'http://' + url;
    request.get(fullUrl, function(err, res) {
      if (!err && res.code === 200) {
        fs.writeFile(paths.archivedSites + '/' + url, res.buffer.toString(), 'utf8', function(err) {
          if (err) {
            throw err;
          }
          // console.log('Downloaded ' + url);
        });
      }
    });
  });
  // wipe out sites.txt
  fs.truncate(paths.list, 0, function() {
    // console.log('Sites.txt has been wiped.');
  });
}; // cron job, download html for sites.txt urls that have not yet been archived


exports.serveArchives = function(url, res, callback) {
  var file = paths.archivedSites + url;
  var contentType = "text/html";
  fs.readFile(file, function(err, data){
    if (err) {
      throw err;
    }
    else {
      callback(res, data, 200, contentType);  // sendResponse passed in as callback
    }
  });
};
