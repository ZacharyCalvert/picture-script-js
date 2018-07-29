var DateUtil = require('./DateUtil.js');
var fs = require ('fs');
var yaml = require('js-yaml');
var PathService = require('./PathService.js');

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

EntryManager.prototype.filterIds = function(filter) {
  var result = [];
  for (var key in this.data) {
    if (filter(this.data[key])) {
      result.push(key);
    }
  }
  return result;
}

EntryManager.prototype.tagFolder = function (folder, tag) {
  var meta = {tagsApplied: 0};
  this.addTagByFilter((entry) => {
    if (entry.paths) {
      for (const path of entry.paths) {
        var pathSplit = path.split('/');
        pathSplit.pop();
        for (var directory = pathSplit.pop(); directory; directory = pathSplit.pop()) {
          if (directory === folder) {
            meta.tagsApplied++;
            return true;
          }
        }
      }
    }
    return false;
  }, tag);
  return meta;
}

EntryManager.prototype.setReviewDone = function(sha256Sum, done = true) {
  console.log("Setting %s review done status to " + done, sha256Sum);
  this.data[sha256Sum].reviewDone = done;
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
        for (const tag of entry.tags) {
          allTags.add(tag);
        }
      }
    }
    return Array.from(allTags);
  }
}

EntryManager.prototype.setTags = function(sha256Sum, tags) {
  this.data[sha256Sum].tags = tags;
}

EntryManager.prototype.setExcludFromExport = function(sha256Sum, excluded = true) {
  console.log("Setting %s to " + (excluded ? "be " : "not be ") + "excluded from export.", sha256Sum);
  this.data[sha256Sum].excludeFromExport = excluded;
}

EntryManager.prototype.getShaSums = function () {
  // return this.data.map(x => x.sha256);
  var entries = this.data;
  var keyList = Object.keys(this.data);
  keyList.sort((a, b) => {
    var dateSort = entries[a].earliestDate - entries[b].earliestDate;
    if (dateSort == 0) {
      return entries[a].paths[0].localeCompare(entries[b].paths[0]);
    } else {
      return dateSort;
    }
  });

  return keyList;
}

EntryManager.prototype.save = function () {
  fs.writeFileSync(this.storagepath, yaml.safeDump(this.data, {'schema': yaml.JSON_SCHEMA}), 'utf8');
}

EntryManager.prototype.saveAsync = function (callback) {
  fs.writeFile(this.storagepath, yaml.safeDump(this.data, {'schema': yaml.JSON_SCHEMA}), 'utf8', callback);
}

EntryManager.prototype.find = function (sha256Sum) {
  sha256Sum = sha256Sum.toUpperCase();
  return this.data[sha256Sum];
}

EntryManager.prototype.getEntry = function (sha256Sum) {
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

EntryManager.prototype.deleteAndIgnore = function (sha256Sum) {
  console.log("Setting %s review done status and ignore on future to " + true, sha256Sum);
  this.data[sha256Sum].reviewDone = true;
  this.data[sha256Sum].ignore = true;

  var managedDirectory = this.storagepath.substring(0, this.storagepath.length - "/pic-man.db".length);
  var toDelete = managedDirectory + this.data[sha256Sum].storedAt;
  delete this.data[sha256Sum].storedAt;

  if (fs.existsSync(toDelete)) {
    fs.unlink(toDelete, (err) => {
      if (err) {
        console.log("Failed to delete %s", toDelete);
        console.error(err);
        throw err;
      }
      console.log(toDelete + ' was deleted');
    });
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