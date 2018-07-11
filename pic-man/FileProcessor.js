var sha256File = require('sha256-file');
var EXIF = require('../exif-js/exif.js');

var fs = require ('fs');

const SHA_DONE = 1;
const EXIF_DONE = SHA_DONE << 1;
const FILE_DATE_DONE = EXIF_DONE << 1;
const EXT_DONE = FILE_DATE_DONE << 1;

const DONE_DONE = SHA_DONE | EXIF_DONE | FILE_DATE_DONE | EXT_DONE;


var processFile = function (entryManager, path, callback) {

  this.entryManager = entryManager;
  this.path = path;
  this.state = 0;
  this.rejected = false;

  function callbackIfDone() {
    if (DONE_DONE == this.state) {
      callback(null, {entry: this.entry, path: path});
    } else {
    }
  }

  function callbackWithError(err) {
    if (!this.rejected) {
      this.rejected = true;
      callback(err, null);
    }
  }

  var shaCallback = function (error, sum) {
    if (error) {
      callbackWithError(error);
    } else {
      this.state |= SHA_DONE;
      this.entry = this.entryManager.addOrCreateEntry(sum);
      this.entryManager.addPath(this.entry, this.path);
      addFileDate();
      addFileDateFromExif();
      addExtension();
    }
  };
  shaCallback.bind(this);

  sha256File(path, shaCallback);

  function writeEarliestFoundDate(mediaDates) {
    if (mediaDates) {
        this.entryManager.updateEarliestDate(this.entry, mediaDates);
    }
  }

  function getFileExtension() {
    return this.path.toUpperCase().split('.').pop();
  }

  function addExtension(path) {
    var extension = getFileExtension(path);
    if (extension) {
        this.entryManager.addExtension(this.entry, extension);
    }
    this.state |= EXT_DONE;
    callbackIfDone();
  }

  function addFileDateFromExif() {
    var extension = this.path.toUpperCase().split('.').pop();
    if (['JPG', 'JPEG'].includes(extension)) {

      var callback = function(err, data) {
        if (err) {
          callbackWithError(err);
        }
        try {
          var ab = new ArrayBuffer(data.length);
          var view = new Uint8Array(ab);
          for (var i = 0; i < data.length; ++i) {
          view[i] = data[i];
          }
          var readExif = EXIF.readFromBinaryFile(ab);
          if (readExif) {
              var dates = [readExif["DateTimeOriginal"], readExif["DateTimeDigitized"], readExif["DateTime"], readExif["dateCreated"]];
              dates = dates.map(x => x ? new Date(Date.parse(x.split(' ').shift().replace(':', "-"))) : x);
              writeEarliestFoundDate(this.entry, dates);
          }
          this.state |= EXIF_DONE;
          callbackIfDone();
        } catch (err) {
          callbackWithError(err);
        }
      };
      callback.bind(this);

      fs.readFile(path, callback);
    } else {
      this.state |= EXIF_DONE;
      callbackIfDone();
    }
  }

  function addFileDate() {
    var callback = function(err, stat) {
      if (err) {
        callbackWithError(err);
      } else {
          // basically looking for earliest, non-epoc date.
          var fileTimes = [stat.birthtime, stat.atime, stat.mtime, stat.ctime];
          writeEarliestFoundDate(fileTimes);
          this.state |= FILE_DATE_DONE;
          callbackIfDone();
      }
    };
    callback.bind(this);
    fs.stat(path, callback);
  }
}

module.exports = processFile;