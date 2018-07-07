
function PathService(shaSum, fileExtension, managedDirectory) {
  this.shaSum = shaSum;
  this.managedDirectory = managedDirectory;
  this.fileExtension = fileExtension;
}

PathService.prototype.getRelative = function() {
  var result = this.shaSum.charAt(0) + '/' + this.shaSum.charAt(1) + '/' + this.shaSum;
  
  if(this.fileExtension) {
    result += '.' + this.fileExtension;
  }

  return result.toUpperCase();
}

PathService.prototype.getActual = function () {
  return this.managedDirectory + (this.managedDirectory.endsWith('/') ? '' : '/') + this.getRelative();
}

module.exports = PathService;