import React, { Component } from "react";

import Slideshow from './SlideshowManager';

import "./slideshow.css"

export default class SlideshowComponent extends Component {

  constructor(props) {
    super(props); // entry, selectedFolder
    console.log("Constructed")

    // state
    // fileExcluded: if the file excluded checkbox is currently checked
    // updatedCount: how many were updated or null
    // excludeFolder: whether or not the next request to the folder exclusion is to be true/false
    this.state = {ids: null, media: [], slideshow: null};
  }

  componentDidMount() {
    console.log("Getting ids");
    if (!this.state.ids) {
      fetch("/ids")
        .then(res => res.json())
        .then(mediaIds => {
          console.log("Ids for slideshow: ", mediaIds);
          this.setState({ids: mediaIds});
          var pictures = [];
          for (var id of mediaIds) {
            fetch("/ids/" + id)
              .then(res => res.json())
              .then(entry => {
                console.log("Pushing new media into state: ", '/media/' + entry.storedAt)
                pictures.push('/media/' + entry.storedAt);
                this.setState({media: pictures});
              });
          }
        });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.slideshow === null 
        && this.state.ids !== null 
        && this.state.ids.length === this.state.media.length) {

      console.log("Starting slideshow");
      var show = new Slideshow("slideshowdiv", this.state.media);
      this.setState({slideshow: show});
    }
  }

  render() {
    return (
      <div class="show" id="slideshowdiv"/>
    )
  }
}