// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');

archive.readListOfUrls(function(urlList) {
  archive.downloadUrls(urlList);
  console.log('Downloaded urls to archives.');
});

// archive.readListOfUrls(archive.downloadUrls(urlList));