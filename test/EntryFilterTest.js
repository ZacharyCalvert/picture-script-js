var assert = require('assert');
var entryFilter = require('../filter/EntryFilter.js')


var mockEntries = [
  {sha256: 'ignored', ignore:true, reviewDone: true, extensions:["PNG"], excludeFromExport: false}, 
  {sha256: 'reviewed_pic', ignore:false, reviewDone: true, extensions:["PNG"], excludeFromExport: false}, 
  {sha256: 'reviewed_pic_exclude', ignore:false, reviewDone: true, extensions:["PNG"], excludeFromExport: true}, 
  {sha256: 'reviewed_pic3', ignore:false, reviewDone: true, extensions:["PNG"], excludeFromExport: false}, 
  {sha256: 'reviewed_video', ignore:false, reviewDone: true, extensions:["MOV"], excludeFromExport: false},
  {sha256: 'reviewed_video_exclude', ignore:false, reviewDone: true, extensions:["MOV"], excludeFromExport: true}, 
  {sha256: 'not_reviewed_pic', ignore:false, reviewDone: false, extensions:["PNG"]}
];

var mockEntryManager = {};
mockEntryManager.find = function(sha) {
  return mockEntries.filter(entry => entry.sha256 == sha)[0];
}

mockEntryManager.filterIds = function(filter) {
  var result = [];
  for (var entry of mockEntries) {
    if (filter(entry)) {
      result.push(entry.sha256);
    }
  }
  return result;
}

describe('EntryFilter', function() {
  describe('Filter entries', function() {
    it('should still skip ignored', function() {
      var ids = entryFilter(mockEntryManager, true, false, false);
      assert.equal(6, ids.length);
      assert(ids.includes("reviewed_pic"));
      assert(!ids.includes("ignored"));
    })

    it('Should only include incuded', function() {
      var ids = entryFilter(mockEntryManager, true, false, false, [entry => entry.sha256 == 'reviewed_pic']);
      assert.equal(1, ids.length);
      assert(ids.includes("reviewed_pic"));
    })

    it('Should only include incuded', function() {
      var ids = entryFilter(mockEntryManager, true, false, false, [entry => entry.sha256 == 'reviewed_pic']);
      assert.equal(1, ids.length);
      assert(ids.includes("reviewed_pic"));
    })

    it('Exclude by default', function() {
      var ids = entryFilter(mockEntryManager, false, false, false);
      assert.equal(4, ids.length);
      assert(ids.includes("reviewed_pic"));
      assert(!ids.includes("reviewed_pic_exclude"));
    })

    it('Only pictures', function() {
      var ids = entryFilter(mockEntryManager, false, true, true);
      assert.equal(2, ids.length);
      assert(ids.includes("reviewed_pic"));
      assert(!ids.includes("reviewed_pic_exclude"));
      assert(!ids.includes("reviewed_video"));
    })

    it('Complex intersection', function() {
      var ids = entryFilter(mockEntryManager, false, true, true, [entry => entry.sha256.startsWith('reviewed_pic')], [entry => entry.sha256 === 'reviewed_pic']);
      assert.equal(1, ids.length);
      assert(ids.includes("reviewed_pic3"));
    })

    it('Should only exclude excluded', function() {
      var ids = entryFilter(mockEntryManager, true, false, false, undefined, [entry => entry.sha256 == 'reviewed_pic']);
      assert.equal(5, ids.length);
      assert(!ids.includes("reviewed_pic"));
    })

    it('throws when no entry manager provided', function () {
      assert.throws(entryFilter);
    })
  });
});