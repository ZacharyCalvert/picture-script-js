const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
var fs = require ('fs');
var path = require('path');
var sha256File = require('sha256-file');
var EXIF = require('../exif-js/exif.js')


const MEDIA = ["JPEG", "JPG", "TIFF", "GIF", "BMP", "PNG", "CR2", "AVI", "MOV", "WMV", "MP4", "MV4P", "MPG", "MPEG", "M4V"];

function openDb(lowDbPath) {
    const adapter = new FileSync(lowDbPath);
    var mediaLowDb = low(adapter);
    return mediaLowDb;
}

function addPath(entry, path) {
    if (entry.paths) {
        var paths = new Set(entry.paths);
        paths.add(path);
        entry.paths = Array.from(paths);
    } else {
        entry.paths = [path];
    }
}

function addFileDateFromExif(entry, path, mediaDb) {
    var extension = path.toUpperCase().split('.').pop();
    if (['JPG', 'JPEG'].includes(extension)) {
        fs.readFile(path, (err, data) => {
            if (err) throw err;
            
            var ab = new ArrayBuffer(data.length);
            var view = new Uint8Array(ab);
            for (var i = 0; i < data.length; ++i) {
              view[i] = data[i];
            }
            var readExif = EXIF.readFromBinaryFile(ab);
            if (readExif) {
                var dates = [readExif["DateTimeOriginal"], readExif["DateTimeDigitized"], readExif["DateTime"], readExif["dateCreated"]];
                dates = dates.map(x => x ? new Date(Date.parse(x.split(' ').shift().replace(':', "-"))) : x);
                writeEarliestFoundDate(entry, mediaDb, dates);
            }
        });
    }
}

function writeEarliestFoundDate(entry, mediaDb, mediaDates) {
    if (mediaDates) {
        mediaDates = mediaDates.filter(date => date && date.getTime() > 0);
        if (mediaDates.length > 0) { 
            if (entry.earliestDate) {
                mediaDates.push(new Date(entry.earliestDate));
            }
            mediaDates.sort((a, b) => a.getTime() - b.getTime() );
            entry.earliestDate = mediaDates[0].getTime();
            mediaDb.write();
        }
    }
}

function addFileDate(entry, path, mediaDb) {
    fs.stat(path, function(err, stat) {
        if (err) {
            console.error("Error occurred processing %s", path);
            console.error(error);
        } else {
            // basically looking for earliest, non-epoc date.
            var fileTimes = [stat.birthtime, stat.atime, stat.mtime, stat.ctime];
            // TODO EXIF DATA
            writeEarliestFoundDate(entry, mediaDb, fileTimes);
            mediaDb.write();
        }
    });
}

function addExtension(entry, path) {
    var extension = path.toUpperCase().split('.').pop();
    if (entry.extensions) {
        var extensions = new Set(entry.extensions);
        extensions.add(extension);
        entry.extensions = Array.from(extensions);
    } else {
        entry.extensions = [extension];
    }
}

function reviewFile(file, lowDb) {
    var sha256Sum = sha256File(file);
    var mediaDb = lowDb.get('media');
    var found = mediaDb.find({sha256: sha256Sum}).value();
    if (!found) {
        found = {sha256: sha256Sum};
        mediaDb.push(found).write();
    }
    addPath(found, file);
    addExtension(found, file);
    addFileDate(found, file, mediaDb);
    addFileDateFromExif(found, file, mediaDb);
    mediaDb.write();
}

function injest(toInjest, lowDb) {
    fs.stat(toInjest, function(err, stat) {
        if (err) {
            console.error("Error occurred processing %s", toInjest);
            console.error(error);
        } else {
            if (stat.isDirectory()) {
                fs.readdir(toInjest, function(err, list) {
                    if (err) {
                        console.error("Error processing directory %s", toInjest);
                        console.error(err);
                    } else {
                        list.forEach(function (file) {
                            file = path.resolve(toInjest, file);
                            var extension = file.toUpperCase().split('.').pop();
                            if (MEDIA.includes(extension)) {
                                injest(file, lowDb);
                            }
                        });
                    }
                });
            } else if (stat.isFile) {
                reviewFile(toInjest, lowDb);
            }
        }
    });
}

module.exports = function (directory, managed) {
    // TODO make sure managed has file and make sure it is a directory
    if (fs.existsSync(managed) && fs.existsSync(managed + "/pic-man.db")) {
        var mediaLowDb = openDb(managed + "/pic-man.db");
        console.log("Opened database from %s", managed + "/pic-man.db")
        injest(directory, mediaLowDb);
        // start crawl
        // process imports
    } else {
        console.log("Managed folder '%s' is not initialized", managed);
    }
}