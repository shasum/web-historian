var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpHelpers = require('../web/http-helpers');
var request = require('http-request');

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

exports.readListOfUrls = readListOfUrls = function(callback){
  fs.readFile(paths.list, 'utf8', function(err, data) {
    if (err) {
      throw err;
    } else {
      callback(data.split('\n'));
    }
  });
};

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
};

exports.isUrlArchived = function(url, callback){
  fs.exists(paths.archivedSites + '/' + url, function(exists){
    callback(exists);
  });
};

exports.downloadUrls = function(urlList){
  urlList.forEach(function(url){
    var fullUrl = 'http://' + url;
    request.get(fullUrl, function(err, res) {
      if (!err && res.code === 200) {
        fs.writeFile(paths.archivedSites + '/' + url, res.buffer.toString(), 'utf8', function(err) {
          if (err) {
            throw err;
          }
        });
      }
    });
  });
  fs.writeFile(paths.list, '','utf8', function() {
  });
};

exports.serveArchives = function(url, res, callback) {
  var file = paths.archivedSites + '/' + url;
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
