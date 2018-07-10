var fs = require ('fs');
var EntryManager = require('./EntryManager.js')
var path = require('path');
var sha256File = require('sha256-file');
var EXIF = require('../exif-js/exif.js');
var PathService = require('./PathService.js');
var mkdirp = require('mkdirp');
var mv = require('mv')
var onExit = require('on-exit');

const MEDIA = ["JPEG", "JPG", "TIFF", "GIF", "BMP", "PNG", "CR2", "AVI", "MOV", "WMV", "MP4", "MV4P", "MPG", "MPEG", "M4V"];

module.exports = function (directory, managed, cmd) {

    var command = cmd;
    var stats = {errors:0, newsha:0, injested:0, copied:0};
    var managedDirectory = managed;

    var exitFunction = function () {
        console.log("Errors encountered: %d", stats.errors);
        console.log("New media files: %d", stats.newsha);
        console.log("Total files processed: %d", stats.injested);
        console.log("Files copied: %d", stats.copied);
        if (this.entryManager) {
            this.entryManager.save();
        }
    }
    exitFunction = exitFunction.bind(this);

    onExit(exitFunction);

    if (fs.existsSync(managed) && fs.existsSync(managed + "/pic-man.db")) {
        this.entryManager = new EntryManager(managed + "/pic-man.db", stats);
        injest(directory);
    } else {
        console.log("Managed folder '%s' is not initialized", managed);
        throw managed + " folder is not initialized.";
    }

    function copyIfRequired(entry, path) {
        var skipCopy = command.nocopy ? true : false;
        skipCopy |= (entry.storedAt ? true : false);
        
        // skip if either we have already stored it OR if we were informed no copy
        if (skipCopy) {
            return;
        }
        
        var pathService = new PathService(entry.sha256, getFileExtension(path), managedDirectory);

        mkdirp(pathService.getActualDirectory(), function (err) {
            if (err) {
                stats.errors++;
                console.error(err);
            } else {
                var updateEntry = (err) => {
                    if (err) {
                        stats.errors++;
                        console.log("Failure to copy %s", path);
                        console.error(err);
                    } else {
                        entry.storedAt = pathService.getRelative();
                        stats.copied++;
                    }
                }
                if (command.move) {
                    mv(path, pathService.getActual(), {clobber: false}, updateEntry);
                } else {
                    fs.copyFile(path, pathService.getActual(), fs.constants.COPYFILE_EXCL, updateEntry);
                }
                
            }
        });
    }

    function addFileDateFromExif(entry, path) {
        var extension = path.toUpperCase().split('.').pop();
        if (['JPG', 'JPEG'].includes(extension)) {
            fs.readFile(path, (err, data) => {
                if (err) {
                    stats.errors++;
                    throw err;
                }
                
                var ab = new ArrayBuffer(data.length);
                var view = new Uint8Array(ab);
                for (var i = 0; i < data.length; ++i) {
                view[i] = data[i];
                }
                var readExif = EXIF.readFromBinaryFile(ab);
                if (readExif) {
                    var dates = [readExif["DateTimeOriginal"], readExif["DateTimeDigitized"], readExif["DateTime"], readExif["dateCreated"]];
                    dates = dates.map(x => x ? new Date(Date.parse(x.split(' ').shift().replace(':', "-"))) : x);
                    writeEarliestFoundDate(entry, dates);
                }
            });
        }
    }

    function writeEarliestFoundDate(entry, mediaDates) {
        if (mediaDates) {
            this.entryManager.updateEarliestDate(entry, mediaDates);
        }
    }

    function addFileDate(entry, path) {
        fs.stat(path, function(err, stat) {
            if (err) {
                stats.errors++;
                console.error("Error occurred processing %s", path);
                console.error(error);
            } else {
                // basically looking for earliest, non-epoc date.
                var fileTimes = [stat.birthtime, stat.atime, stat.mtime, stat.ctime];
                writeEarliestFoundDate(entry, fileTimes);
            }
        });
    }

    function getFileExtension(path) {
        return path.toUpperCase().split('.').pop();
    }

    function addExtension(entry, path) {
        var extension = getFileExtension(path);
        if (extension) {
            this.entryManager.addExtension(entry, extension);
        }
    }

    function reviewFile(file) {

        var extension = file.toUpperCase().split('.').pop();
        if (!MEDIA.includes(extension)) {
            return; // ignore non-media file
        }

        var sha256Sum = sha256File(file);
        var found = this.entryManager.addOrCreateEntry(sha256Sum);
        this.entryManager.addPath(found, file);
        addExtension(found, file);
        addFileDate(found, file);
        addFileDateFromExif(found, file);
        copyIfRequired(found, file);
        stats.injested++;
    }

    function injest(toInjest) {
        fs.stat(toInjest, function(err, stat) {
            if (err) {
                stats.errors++;
                console.error("Error occurred processing %s", toInjest);
                console.error(error);
            } else {
                if (stat.isDirectory()) {
                    fs.readdir(toInjest, function(err, list) {
                        if (err) {
                            stats.errors++;
                            console.error("Error processing directory %s", toInjest);
                            console.error(err);
                        } else {
                            list.forEach(function (file) {
                                file = path.resolve(toInjest, file);
                                injest(file);
                            });
                        }
                    });
                } else if (stat.isFile) {
                    reviewFile(toInjest);
                }
            }
        });
    }
}