var fs = require ('fs');
var EntryManager = require('./EntryManager.js')
var path = require('path');
var PathService = require('./PathService.js');
var mkdirp = require('mkdirp');
var mv = require('mv')
var onExit = require('on-exit');
var processFileMetadata = require('./FileProcessor.js');
var Check = require('./CheckEntry')

const MEDIA = ["JPEG", "JPG", "TIFF", "GIF", "BMP", "PNG", "CR2", "AVI", "MOV", "WMV", "MP4", "MV4P", "MPG", "MPEG", "M4V"];

module.exports = function (directory, managed, cmd) {

    var command = cmd;
    var stats = {errors:0, newsha:0, injested:0, copied:0, mediaFiles:0, repaired: 0};
    var managedDirectory = managed;
    var files = [];
    var processing = false;

    var exitFunction = function () {
        console.log("New media files: %d", stats.newsha);
        console.log("Total files processed: %d", stats.injested);
        console.log("Files copied: %d", stats.copied);
        console.log("Media files discovered: %d", stats.mediaFiles);
        if (stats.errors > 0) {
            console.log("\x1b[31m%s\x1b[0m", "Errors encountered: " + stats.errors);
        } else {
            console.log("Errors encountered: %d", stats.errors);
        }
        if (stats.repaired > 0) {
            console.log("\x1b[32m%s\x1b[0m", "Successful repairs: " + stats.repaired);
        }
        if (this.entryManager) {
            this.entryManager.save();
        }

        new Check(managedDirectory).runCheck();
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
        skipCopy |= (entry.ignore ? true : false);
        
        // skip if either we have already stored it OR if we were informed no copy
        if (skipCopy) {
            return;
        }
        
        var pathService = new PathService(entry.sha256, getFileExtension(path), managedDirectory);

        var isRepair = false;
        if (entry.storedAt) {
            if (!fs.existsSync(managed + entry.storedAt)) {
                isRepair = true;
            } else {
                // copy not needed
                return;
            }
        }

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
                        if (isRepair) {
                            stats.repaired++;
                        }
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

    function getFileExtension(path) {
        return path.toUpperCase().split('.').pop();
    }

    function isMediaFile(file) {
        return MEDIA.includes(getFileExtension(file));
    }

    function processFiles() {
        if (this.processing) {
            return;
        }
        var processNext = function (callback) {
            var toProcess = files.pop();
            if (toProcess) {
                this.processing = true;
                processFileMetadata(this.entryManager, toProcess, callback);
            } else {
                this.processing = false;
            }
        }
        processNext.bind(this);
        this.processing = true;
        var callback = function(err, result) {
            if (err) {
                stats.errors++;
                console.error(err);
                this.processing = false;
            } else {
                stats.injested++;
                if (stats.injested % 100 == 0) {
                    console.log("Processed %d media files, %d remaining", stats.injested, files.length);
                }
                copyIfRequired(result.entry, result.path);
                processNext(this.callback);
            }
        };
        callback.chainAsyncCallback = callback;
        this.callback = callback;
        callback.bind(this);

        processNext(callback);
        
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
                } else if (stat.isFile && isMediaFile(toInjest)) {
                    stats.mediaFiles++;
                    files.push(toInjest);
                    processFiles();
                }
            }
        });
    }
}