import React, { Component } from "react";

export default class Media extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    var IMG_EXT = ["JPEG", "JPG", "TIFF", "GIF", "BMP", "PNG"];
    const picture = IMG_EXT.includes(this.props.ext);
    const path = "/media/" + this.props.path;
    return (

      <div>
        {picture ? (
          <img src ={path} />
        ) : (
          <h1>it's a movie...</h1>
        )}
      </div>
    );
  }
}