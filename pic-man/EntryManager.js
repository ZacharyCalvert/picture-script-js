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

EntryManager.prototype.addTagByFilter = function (filter, tag) {
  for (var key in this.data) {
    if (filter(this.data[key])) {
      var currentTags = this.getTags(key);
      if (!currentTags.includes(tag)) {
        currentTags.unshift(tag);
        this.setTags(key, currentTags);
      }
    }
  }
}

EntryManager.prototype.getTags = function(sha256Sum) {
  console.info("Requesting tags of " + sha256Sum);
  if (sha256Sum) {
    var result = this.data[sha256Sum].tags;
    if (result === undefined) {
      result = [];
    }
    return result;
  } else {
    var allTags = new Set();
    for (var key in this.data) {
      var entry = this.data[key];
      if (entry.tags) {
        for (var tag in entry.tags) {
          allTags.add(tag);
        }
      }
    }
    return Array.from(allTags);
  }
}

EntryManager.prototype.setTags = function(sha256Sum, tags) {
  console.log("Setting %s tags", sha256Sum);
  console.log(tags);
  this.data[sha256Sum].tags = tags;
}

EntryManager.prototype.getShaSums = function () {
  // return this.data.map(x => x.sha256);
  var entries = this.data;
  var keyList = Object.keys(this.data);
  keyList.sort((a, b) => {
    entries[a].earliestDate - entries[b].earliestDate;
  });
  return keyList;
}

EntryManager.prototype.save = function () {
  fs.writeFileSync(this.storagepath, yaml.safeDump(this.data, {'schema': yaml.JSON_SCHEMA}), 'utf8');
}

EntryManager.prototype.find = function (sha256Sum) {
  sha256Sum = sha256Sum.toUpperCase();
  return this.data[sha256Sum];
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
module.exports.loadEntryManager = (managed) => {
  if (fs.existsSync(managed) && fs.existsSync(managed + "/pic-man.db")) {
    return new EntryManager(managed + "/pic-man.db");
  } else {
      console.log("Managed folder '%s' is not initialized", managed);
      throw managed + " folder is not initialized.";
  }
}