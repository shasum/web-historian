// var path = require('path');
// var fs = require('fs');
// var url = require('url');
// require more modules/folders here!
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');

exports.handleRequest = function (req, res) {
  var asset = routes[req.url];
  // console.log('asset:', asset);
  if (asset) {
    httpHelpers.serveAssets(res, asset, httpHelpers.sendResponse);
  }
  else {
    archive.serveArchives(req, res, httpHelpers.sendResponse);
    // httpHelpers.sendResponse(res, 'File Not Found...', 404);
  }
  // res.end(archive.paths.list);
};

var routes = {
  '/': 'index.html',
  '/index.html': 'index.html',
  '/styles.css': 'styles.css'
};