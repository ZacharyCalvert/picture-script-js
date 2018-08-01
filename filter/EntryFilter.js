
const IMG_EXT = ["JPEG", "JPG", "TIFF", "GIF", "BMP", "PNG"];

function matchingIds(filters, entries) {
  var includeIdSet = new Set([]);
  for (var filter of filters) {
    var matches = entries.filter(filter).map(entry => entry.sha256);
    for (var match of matches) {
      includeIdSet.add(match);
    }
  }
  return Array.from(includeIdSet);
}

function getInitialEntries(entryManager, includeAll, requiredReview) {
  var viableIds = entryManager.filterIds(entry => {
    return (
      (!requiredReview || entry.reviewDone) // either reviewed or no review required
      && 
      !entry.ignore // deleted
      && 
      (includeAll || !entry.excludeFromExport)
    );
  });
  console.log("Viable ids", viableIds);

  var viableEntries = [];
  for (var id of viableIds) {
    viableEntries.push(entryManager.find(id));
  }
  console.log("Initial entries", viableEntries);
  return viableEntries;
}

function filterIds(entryManager, includeAll = false, requiredReview = true, picturesOnly = true, includeFilter = [], excludeFilter = []) {
  if (!entryManager) {
    throw "Entry manager must be provided";
  }

  var entries = getInitialEntries(entryManager, includeAll, requiredReview);
  if (picturesOnly) {
    entries = entries.filter(entry => IMG_EXT.includes(entry.extensions[0].toUpperCase()));
  }

  if (includeFilter.length > 0) {
    var ids = matchingIds(includeFilter, entries);
    entries = entries.filter(entry => ids.includes(entry.sha256));
  }

  if (excludeFilter.length > 0) {
    var ids = matchingIds(excludeFilter, entries);
    entries = entries.filter(entry => !ids.includes(entry.sha256));
  }

  return entries.map(entry => entry.sha256);
}

module.exports = filterIds;