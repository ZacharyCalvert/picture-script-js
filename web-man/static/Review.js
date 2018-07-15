import React, { Component } from "react";
import "./app.css";
import ReviewCard from './ReviewCard.js';

export default class App extends Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.state = { currentId: 0 };
  }

  render() {
    var progress = this.props.ids.length > 0 ? (this.state.currentId * 100.0 / this.props.ids.length) + "%" : "100%";
    
    return (
      <div>
        <p>On {this.state.currentId + 1} of {this.props.ids.length}, or {progress}</p>
        <ReviewCard id={this.props.ids[this.state.currentId]}/>
      </div>
    );
  }
}