import React, { Component } from "react";

import "./media.css";

export default class Media extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    var IMG_EXT = ["JPEG", "JPG", "TIFF", "GIF", "BMP", "PNG", "CR2"];
    const picture = IMG_EXT.includes(this.props.ext.toUpperCase());
    const path = "/media/" + this.props.path;
    return (

      <div>
        {picture ? (
          <img src ={path} />
        ) : (
          <video width="320" height="240" controls>
            <source src={path}/>
          </video>
        )}
      </div>
    );
  }
}