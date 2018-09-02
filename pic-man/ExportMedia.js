var fs = require ('fs');
var onExit = require('on-exit');
var mkdirp = require('mkdirp');
const path = require('path');
var sha256File = require('sha256-file');
var yaml = require('js-yaml');

const YML_FILE = "media.yml"

function ExportMedia() {
}

ExportMedia.prototype.exitFunction = function () {

  fs.writeFileSync(this.getExportYmlFilePath(), yaml.safeDump(this.entries, {'schema': yaml.JSON_SCHEMA}), 'utf8');

  console.log("Total Ids matched: ", this.stats.idsTotal);
  console.log("Exported: ", this.stats.copied);
  console.log("Existing (ignored): ", this.stats.notCopied)
}

ExportMedia.prototype.getExportYmlFilePath = function () {
  return path.format({
    dir: this.target,
    base: YML_FILE
  });
}

ExportMedia.prototype.initTargetFolder = function (onSuccess) {
  fs.exists(this.target, (exists) => {
    if (exists) {
      onSuccess();
    } else {
      console.log("Creating folder ", this.target);
      mkdirp(this.target, function (err) {
        if (err) { 
          console.error(err) 
        } else {
          onSuccess();
        }
      });
    }
  });
}

ExportMedia.prototype.loadExistingMediaYml = function (onComplete) {
  var ymlFile = this.getExportYmlFilePath();
  fs.exists(ymlFile, (exists) => {
    if (exists) {
      this.entries = yaml.safeLoad(fs.readFileSync(ymlFile, 'utf8'), {'schema': yaml.JSON_SCHEMA});
      console.log("Loaded existing %s with %d media definitions", YML_FILE, Object.keys(this.entries).length);
      onComplete();
    } else {
      this.entries = {};
      console.log("No existing media definition discovered (media.yml)");
      onComplete();
    }
  });
}

ExportMedia.prototype.copyWithIteration = function (id, stats, iteration, onCollide, onSuccess) {
  var entry = this.entryManager.find(id);
  var parsedFile = path.parse(entry.paths[0]);
  var source = path.resolve(this.managed, entry.storedAt);
  var destination = path.format({
    dir: this.target,
    name: parsedFile.name,
    ext: parsedFile.ext
  });
  if (iteration > 0 ) {
    destination = path.format({
      dir: this.target,
      name: parsedFile.name + '-' + iteration,
      ext: parsedFile.ext
    });
  }

  fs.exists(destination, (exists) => {
    if (exists) {
      // see if match, if sha match, do nothing
      // if no match, iterate and move to next
      sha256File(destination, (err, sum) => {
        if (err) {
          console.error("Failure inspecting sha sum of ", destination);
          throw err;
        } else if (sum.toUpperCase() === id.toUpperCase()) {
            stats.notCopied++;
            onSuccess();
        } else {
          onCollide();
        }
      });
    } else {
      fs.copyFile(source, destination, fs.constants.COPYFILE_EXCL, (err) => {
        if (err) {
          console.error("Failed to copy %s to %s", source, destination);
          throw err;
        } else {
          stats.copied++;
          this.entries[id] = entry;
          this.entries[id].storedAt = path.basename(destination);
          onSuccess();
        }
      });
    }
  });
}

ExportMedia.prototype.copyEntry = function (id, onSuccess) {
  if (!id) {
    return;
  }
  if (id in this.entries) {
    this.stats.notCopied++;
    onSuccess();
    return;
  }
  var iteration = 0;
  var stats = this.stats;
  let onCollide = () => {
    iteration++;
    this.copyWithIteration(id, stats, iteration, onCollide, onSuccess);
  }
  this.copyWithIteration(id, stats, iteration, onCollide, onSuccess);
}

ExportMedia.prototype.performCopies = function() {
  console.log("Ready to perform copies of %d media files", this.ids.length);
  onExit(this.exitFunction.bind(this));
  var toCopy = this.ids.slice();
  if (toCopy.length > 0) {
    let next = () => {
      var id = toCopy.pop();
      this.copyEntry(id, next);
    };
    this.copyEntry(toCopy.pop(), next);
  }
}

ExportMedia.prototype.export = function (ids, managed, entryManager, target) {
  console.log("Export request received for %d ids to %s", ids.length, target);
  this.stats = {idsTotal: ids.length, copied: 0, notCopied: 0};
  this.entries = null;
  this.ids = ids;
  this.managed = managed;
  this.entryManager = entryManager;
  this.target = target;
  this.initTargetFolder(() => this.loadExistingMediaYml((() => this.performCopies())));
}

module.exports = function(ids, managed, entryManager, target) {
  new ExportMedia().export(ids, managed, entryManager, target);
}