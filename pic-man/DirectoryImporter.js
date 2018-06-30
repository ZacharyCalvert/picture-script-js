const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
var fs = require ('fs');
var path = require('path');

function openDb(lowDbPath) {
    const adapter = new FileSync(lowDbPath);
    var mediaLowDb = low(adapter);
    return mediaLowDb;
}

function reviewFile(file, lowDb) {
    console.log("File received for review: %s", file);
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
                            injest(file, lowDb);
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