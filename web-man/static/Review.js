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
      <div class="container">
        <div class="row">
          <div class="col-6">
            <button onClick={this.props.onPrevious} type="button" class="btn btn-primary">Previous</button>
          </div>
          <div class="col-6 col-6">
            <button onClick={this.props.onNext} type="button" class="btn btn-primary">Next</button>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <p>On {this.props.currentId + 1} of {this.props.ids.length}, or {progress}</p>
          </div>
          <div class="col-12">
            <ReviewCard id={this.props.ids[this.props.currentId]}/>
          </div>
        </div>
      </div>
    );
  }
}