var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpHelpers = require('../web/http-helpers');

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

exports.readListOfUrls = function(file, callback){
  // read file asynchronously, then pass data to isUrlInList (callback)
}; // read sites.txt

exports.isUrlInList = function(url, list){
  return _.contains(list, url);
}; // check if url is in sites.txt, return true or false

exports.addUrlToList = function(){
}; // add url to sites.txt

exports.isUrlArchived = isUrlArchived = function(url){
  // console.log('Entered isUrlArchived', url);
  return fs.existsSync(paths.archivedSites + url);
}; // if url is in /sites folder

exports.downloadUrls = function(){
}; // cron job, download html for sites.txt urls that have not yet been archived


exports.serveArchives = function(req, res, callback) {
  // console.log('Entered serveArchives', req.url);
  if (isUrlArchived(req.url)) {
    // console.log('Archive Fetch Success');
    var file = paths.archivedSites + req.url;
    var contentType = "text/html";
    fs.readFile(file, function(err, data){
      if (err) {
        throw err;
      }
      else {
        callback(res, data, 200, contentType);  // sendResponse passed in as callback
      }
    });
  }
  else {
    // console.log("Archive Fetch Unsuccessful");
    httpHelpers.sendResponse(res, 'File Not Found...', 404);
    // !(isUrlInList)
      // addUrlToList
    // serveAssets with loading.html
  }
};