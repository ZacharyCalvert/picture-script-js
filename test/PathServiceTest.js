var assert = require('assert');
var PathService = require('../pic-man/PathService.js')

describe('PathService', function() {
  describe('#getRelative()', function() {
    it('should give relative path based on sha sum ABC and no extension', function() {
      var toTest = new PathService('ABC', undefined, '/some/managed/path')
      assert.equal('A/B/ABC', toTest.getRelative());
    });
  });

  describe('#getRelative()', function() {
    it('should give relative path based on sha sum ABC and with extension', function() {
      var toTest = new PathService('ABC', 'png', '/some/managed/path')
      assert.equal('A/B/ABC.PNG', toTest.getRelative());
    });
  });

  describe('#getRelative()', function() {
    it('should force upper case relative path based on sha sum abc and with extension', function() {
      var toTest = new PathService('abc', 'png', '/some/managed/path')
      assert.equal('A/B/ABC.PNG', toTest.getRelative());
    });
  });

  describe('#getActual()', function() {
    it('should append path with slash', function() {
      var toTest = new PathService('abc', 'png', '/some/managed/path')
      assert.equal('/some/managed/path/A/B/ABC.PNG', toTest.getActual());
    });
  });

  describe('#getActual()', function() {
    it('should not duplicate path with slash', function() {
      var toTest = new PathService('abc', 'png', '/some/managed/path/')
      assert.equal('/some/managed/path/A/B/ABC.PNG', toTest.getActual());
    });
  });
});