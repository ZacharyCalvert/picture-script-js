var entryFilter = require('./entryFilter.js');

const VIDEO = ["AVI", "MOV", "WMV", "MP4", "MV4P", "MPG", "MPEG", "M4V"];

function folderMatch(folder, entry) {
  if (entry.paths) {
    for (const path of entry.paths) {
      var pathSplit = path.split('/');
      pathSplit.pop();
      for (var directory = pathSplit.pop(); directory; directory = pathSplit.pop()) {
        if (directory === folder) {
          return true;
        }
      }
    }
  }
  return false;
}

function tagMatch(tagToMatch, entry) {
  if (entry.tags) {
    for (var tag of entry.tags) {
      if (tag.startsWith(tagToMatch)) {
        // support either exact match or : separator such as "people:family:Crystal" matchin "people:family"
        if ((tag === tagToMatch) || tag.startsWith(tagToMatch + ':')) {
          return true;
        }
      }
    }
  }
  return false;
}

function commandFilter(cmd, entryManager) {

  var includeFilters = [];
  var excludeFilters = [];
  var picturesOnly = true;

  if (cmd.media) {
    if (cmd.media === 'photo') {
      picturesOnly = true;
    } else if (cmd.media == 'all') {
      picturesOnly = false;
    } else {
      picturesonly = false;
      excludeFilters.push(entry => !VIDEO.includes(entry.extensions[0].toUpperCase()))
    }
  }

  if (cmd.includeFolder) {
    for (var folder of cmd.includeFolder) {
      includeFilters.push(folderMatch.bind(undefined, folder));
    }
  }

  if (cmd.excludeFolder) {
    for (var folder of cmd.excludeFolder) {
      excludeFilters.push(folderMatch.bind(undefined, folder));
    }
  }

  if (cmd.includeTag) {
    for (var tag of cmd.includeTag) {
      includeFilters.push(tagMatch.bind(undefined, tag));
    }
  }

  if (cmd.excludeTag) {
    for (var tag of cmd.excludeTag) {
      excludeFilters.push(tagMatch.bind(undefined, tag));
    }
  }

  return entryFilter(entryManager, cmd.bypassExclusion, !cmd.notReviewed, picturesOnly, includeFilters, excludeFilters);
}

module.exports = commandFilter;