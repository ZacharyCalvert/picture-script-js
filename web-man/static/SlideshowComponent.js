import React, { Component } from "react";

export default class SlideshowComponent extends Component {

  constructor(props) {
    super(props); // entry, selectedFolder
    console.log("Constructed")

    // state
    // fileExcluded: if the file excluded checkbox is currently checked
    // updatedCount: how many were updated or null
    // excludeFolder: whether or not the next request to the folder exclusion is to be true/false
    this.state = {ids: null, media: null};
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



  render() {
    return (
      <div>
      {this.state.media ? 
        <h1>{this.state.media.length}</h1>
        :
        <div/>
      }
      </div>
    )
  }
  
}