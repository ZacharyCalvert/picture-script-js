var DateUtil = require('./DateUtil.js');
var fs = require ('fs');
var yaml = require('js-yaml');

function EntryManager(storagePath, stats) {

  if (typeof storagePath !== 'string') {
    throw "Storage path must be file path in string format"
  }

  this.storagepath = storagePath;
  this.data = yaml.safeLoad(fs.readFileSync(storagePath, 'utf8'), {'schema': yaml.JSON_SCHEMA});

  if (stats) {
    this.stats = stats;
  } else {
    this.stats = {};
  }
}

EntryManager.prototype.save = function () {
  fs.writeFileSync(this.storagepath, yaml.safeDump(this.data, {'schema': yaml.JSON_SCHEMA}), 'utf8');
}

EntryManager.prototype.addOrCreateEntry = function (sha256Sum) {
  sha256Sum = sha256Sum.toUpperCase();
  if (undefined === this.data[sha256Sum]) {
    this.data[sha256Sum] = {sha256: sha256Sum};
    this.stats.newsha++;
  }
  return this.data[sha256Sum];
}

EntryManager.prototype.addPath = function (entry, path) {
  if (entry.paths) {
      var paths = new Set(entry.paths);
      paths.add(path);
      entry.paths = Array.from(paths);
  } else {
      entry.paths = [path];
  }
}

EntryManager.prototype.updateEarliestDate = function (entry, dates) {
  var dateUtil = new DateUtil(entry.earliestDate);
  var earliest = dateUtil.getEarliestDate(dates);
  if (earliest && earliest > 0) {
    entry.earliestDate = earliest;
  }
}

EntryManager.prototype.addExtension = function(entry, extension) {
  if (entry.extensions) {
    var extensions = new Set(entry.extensions);
    extensions.add(extension);
    entry.extensions = Array.from(extensions);
  } else {
      entry.extensions = [extension];
  }
}

module.exports = EntryManager
module.exports.initDb = (path) => {
  fs.writeFileSync(path, yaml.safeDump({}, {'schema': yaml.JSON_SCHEMA}), 'utf8');
}