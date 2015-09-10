var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');

var dataHandler = function(req, callback){
  var data = '';
  req.on('data', function(packet) {
    data += packet;
  });

  req.on('end', function() {
    callback(data.slice(4));
  });
};

var actions = {
  'GET': function(req, res){
    var asset = routes[req.url];
    if (asset) {
      httpHelpers.serveAssets(res, asset, httpHelpers.sendResponse);
    }
    else {
      archive.isUrlArchived(req.url, function(exists) {
        if (exists) {
          archive.serveArchives(req.url, res, httpHelpers.sendResponse);
        } else {
          httpHelpers.sendResponse(res, 'File Not Found...', 404);
        }
      });
    }
  },
  'POST': function(req, res){
    dataHandler(req, function(data){
      archive.isUrlArchived(data, function(exists) {
        if (exists) {
          archive.serveArchives(data, res, httpHelpers.sendResponse);
        } else {
          archive.isUrlInList(data, function(exists){
            if (!exists) {
              archive.addUrlToList(data, function() {
                httpHelpers.serveAssets(res, 'loading.html', httpHelpers.sendResponse);
              });
            }
            else {
              httpHelpers.serveAssets(res, 'loading.html', httpHelpers.sendResponse);
            }
          });
        }
      });
    });
  }
};

exports.handleRequest = function (req, res) {

  var action = actions[req.method];
  if (action) {
    action(req, res);
  } else {
  }
};

var routes = {
  '/': 'index.html',
  '/index.html': 'index.html',
  '/styles.css': 'styles.css'
};