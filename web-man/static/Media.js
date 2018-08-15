import React, { Component } from "react";
var $ = require('jquery');

import "./media.css";

const IMG_EXT = ["JPEG", "JPG", "TIFF", "GIF", "BMP", "PNG", "CR2"];

export default class Media extends Component {
  constructor(props) {
    super(props);
  }

  isPicture(ext) {
    return IMG_EXT.includes(this.props.ext.toUpperCase());
  }

  setMovieSource() {

    var jqueryVideo = $('#videoreview');
    var videoElement = null;
    if (jqueryVideo) {
      videoElement = jqueryVideo.get(0);
    }

    if (videoElement) {
      videoElement.pause();
      videoElement.removeAttribute('src'); // empty source
      videoElement.load();
      videoElement.src = "/media/" + this.props.path;
      videoElement.load();
    }
  }

  render() {
    const picture = this.isPicture(this.props.ext);
    const path = "/media/" + this.props.path;

    if (this.props.hide === false && !picture) {
      // address video rendering issue
      this.setMovieSource();
    }

    return (

      <div>
        {picture ? (
          <img src ={path} />
        ) : (
          <video id="videoreview" width="320" height="240" controls>
            <source src={path}/>
          </video>
        )}
      </div>
    );
  }
}