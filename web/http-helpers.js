var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  var file = archive.paths.siteAssets + '/' + asset;
  var contentType = getContentType(asset);
  var statusCode = (asset === 'loading.html') ? 302 : 200;

  // console.log('File =', file);
  fs.readFile(file, function(err, data) {
    if (err) {
      throw err;
    }
    else {
      callback(res, data, statusCode, contentType);  // sendResponse passed in as callback
    }
  });
};

// As you progress, keep thinking about what helper functions you can put here!
exports.sendResponse = function(response, data, statusCode, contentType){
  statusCode = statusCode || 200;
  contentType = contentType || "text/html";
  headers['Content-Type'] = contentType;
  response.writeHead(statusCode, headers);
  response.end(data);
};

var getContentType= function(asset) {
  var ext = asset.split('.')[1];
  return contentTypes[ext];
};

var contentTypes = {
  'html': 'text/html',
  'css': 'text/css',
  'js': 'application/javascript'
};