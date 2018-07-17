import React, { Component } from "react";
import "./app.css";
import ReviewCard from './ReviewCard.js';

export default class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    var progress = this.props.ids.length > 0 ? (this.props.currentId * 100.0 / this.props.ids.length).toFixed(1) + "%" : "100%";
    
    return (
      <div>
        <p>On {this.props.currentId + 1} of {this.props.ids.length}, or {progress}</p>
        <ReviewCard id={this.props.ids[this.props.currentId]}/>
      </div>
    );
  }
}