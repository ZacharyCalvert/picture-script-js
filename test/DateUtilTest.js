var assert = require('assert');
var DateUtil = require('../pic-man/DateUtil.js')

// describe('PathService', function() {
//   describe('#getRelative()', function() {
//     it('should give relative path based on sha sum ABC and no extension', function() {
//       var toTest = new PathService('ABC', undefined, '/some/managed/path')
//       assert.equal('A/B/ABC', toTest.getRelative());
//     });
//   });

describe('DateUtil', function() {
  describe('#construct', function() {
    it('should support undefined', function() {
      assert.equal(0, new DateUtil().getEarliestDate())
    })
    it('should support numerical', function() {
      assert.equal(100, new DateUtil(100).getEarliestDate())
    })
    it('should support date', function() {
      var date = new Date();
      date.setMilliseconds(200);
      assert.equal(200, new DateUtil(new Date(200)).getEarliestDate())
    })
  })

  describe('#getEarliestDate', function() {
    it('should support numerical', function() {
      assert.equal(50, new DateUtil(100).getEarliestDate(50))
    })
    it('should support numerical array', function() {
      assert.equal(20, new DateUtil(100).getEarliestDate([80, 90, 20]))
    })
    it('should support Date', function() {
      assert.equal(20, new DateUtil(100).getEarliestDate(new Date(20)))
    })
    it('should support Date array', function() {
      assert.equal(80, new DateUtil(100).getEarliestDate([new Date(80), new Date(80)]))
    })
    it('should support mixed array', function() {
      assert.equal(20, new DateUtil(100).getEarliestDate([new Date(80), 20, new Date(80)]))
    })
    it('should support undefined', function() {
      assert.equal(100, new DateUtil(100).getEarliestDate(undefined))
    })
    it('should support undefined mixed', function() {
      assert.equal(20, new DateUtil(100).getEarliestDate([new Date(20), undefined, 60, new Date(80)]))
    })
  })
});