var fs = require ('fs');
var EntryManager = require('./EntryManager.js');

function Check(folder) {
  this.folder = folder;
  this.entryManager = EntryManager.loadEntryManager(folder);
}

Check.prototype.runCheck = function () {
  var ids = this.entryManager.getShaSums();
  var stats = {total: ids.length, healthy: 0, ignored:0, notFound: 0, reviewed: 0}
  for (var id of ids) {
    var entry = this.entryManager.getEntry(id);
    var file = this.folder + entry.storedAt;

    if (entry.reviewDone || entry.ignored) {
      stats.reviewed++;
    }

    if (entry.ignored) {
      stats.ignored = stats.ignored +1;
    } else if (fs.existsSync(file)) {
      stats.healthy++;
    } else {
      console.log("Missing file at %s", file);
      console.log(entry.paths);
      stats.notFound++;
    }
  }

  console.log("Total IDs:       %d", stats.total);
  console.log("Reviewed:        %d", stats.reviewed);
  console.log("Healthy IDs:     %d", stats.healthy);
  console.log("Deleted/ignored: %d", stats.ignored);
  console.log("Broken links:    %d", stats.notFound);

  return stats;
}

module.exports=Check