var _ = require('lodash');
var $ = require('jquery');

/*
this.divId = the DIV id to render our content
this.images = the array of path locations to images for the slideshow
this.offset = current offset count (tick)
this.dimentions = {width: divWidth, height: divHeight}
this.activeImages = [] of {id: imageId, 
    origWidth: imageOrigWidth, 
    origHeight: imageOrigHeight, 
    img: Image(), 
    idx: images index,
    drawnAtOffset: offset during initial draw}
*/

const buffer = 5;
const delayBetweenMove = 30;
const delayBetweenLoad = 1000;
const delayBetweenRemoveRight = 500;
const delayForScreenResizeRecovery = 3000;
const leftLoadBuffer = 100;

function SlideShow(divId, images) {
  console.log("Initial images: ", images);
  this.divId = divId;
  this.images = images;
  this.offset = 0;
  this.nextImageIndex = 0;
  this.addingImage = false;
  var dimentions = this.identifyDivSize();
  this.loadInitialImages(dimentions);
  this.activeImages = [];
}

SlideShow.prototype.identifyDivSize = function () {
  var divDimentions = {};
  var divElement = $('#' + this.divId);
  divDimentions.width = divElement.width();
  divDimentions.height = divElement.height();
  this.dimentions = divDimentions;
  return divDimentions;
}

SlideShow.prototype.loadInitialImages = function (dimentions) {
  var divElement = $('#' + this.divId);
  this.prepImage(0, dimentions.height, (image) => {

    // TODO calculate offset
    // store drawnAtOffset
    image.drawnAtOffset = this.offset;

    divElement.append(image.img);
    this.activeImages.push(image);
  });
  setInterval(this.move.bind(this), delayBetweenMove);
  setInterval(this.loadNext.bind(this), delayBetweenLoad);
  setInterval(this.removeOffScreen.bind(this), delayBetweenRemoveRight);
  setInterval(this.identifyDivSize.bind(this), delayForScreenResizeRecovery);
}

SlideShow.prototype.resizeImageElement = function (entry, maxHeight) {
  if (maxHeight > entry.origHeight) {
    entry.img.height = entry.origHeight;
    entry.img.width = entry.origWidth;
  } else {
    var shrinkFactor = 1.0 * maxHeight / entry.origHeight;
    entry.img.width = Math.floor(entry.origWidth * shrinkFactor);
    entry.img.height = Math.floor(entry.origHeight * shrinkFactor);
  }
}

SlideShow.prototype.loadNext = function () {

  if (this.activeImages.length == 0) {
    return;
  }
  var leftMostImage = this.activeImages[0]; // leftmost image 

  if (isNaN(leftMostImage.drawnAtOffset) ||
      ((leftMostImage.drawnAtOffset + this.offset) <= (-1 * leftLoadBuffer))) {
    // leftLoadBuffer is hidden screen buffer before tripping next image load
    return;
  }

  var offset = this.offset;
  var currentLeftPixel = leftMostImage.drawnAtOffset + offset;

  var divElement = $('#' + this.divId);
  var toLoadIndex = (leftMostImage.idx + 1) % this.images.length;
  this.prepImage(toLoadIndex, this.dimentions.height, (image) => {

    var leftStartWithOffset = currentLeftPixel - buffer - image.img.width - offset;

    image.drawnAtOffset = leftStartWithOffset;
    image.img.className = 'initial';

    divElement.append(image.img);
    this.addingImage = false;
    this.activeImages.unshift(image);
  });

}

SlideShow.prototype.removeOffScreen = function () {
  if (this.activeImages.length === 0) {
    return;
  }
  var rightmost = this.activeImages[this.activeImages.length - 1];
  var leftPixel = rightmost.drawnAtOffset + this.offset;
  if (leftPixel > this.dimentions.width) {
    console.log("unloading image: ", '#' + rightmost.id);
    $('#' + rightmost.id).remove();
    this.activeImages.pop(); // always rightmost to get remove
    delete rightmost.img; // best attempt to free memory
  }
}

SlideShow.prototype.move = function () {

  this.offset++;

  var currentActiveImageCount = this.activeImages.length;

  for (var imageIdx = 0; imageIdx < currentActiveImageCount; imageIdx++) {
    var image = this.activeImages[imageIdx];
    var offset = this.offset;
    var left = image.drawnAtOffset + offset;

    var jqueryImage = $('#' + image.id);
    jqueryImage.css({
      left: left
    });
    jqueryImage.removeClass('initial');
  }

}

SlideShow.prototype.prepImage = function (index, maxHeight, present) {
  console.log("Preparing image of index " + index);
  var resize = this.resizeImageElement;
  var result = {id: _.uniqueId() + '-' + index, img: new Image(), idx: index};
  result.img.id = result.id;
  result.loading = true;
  result.img.onload = function () {
    result.origWidth = this.width;
    result.origHeight = this.height;
    result.img.id = result.id;
    resize(result, maxHeight);
    result.loading = false;
    present(result);
  }
  result.img.src = this.images[index];
  return result;
}

module.exports = SlideShow;