import React, { Component } from "react";

import "./operations.css"

export default class Operations extends Component {
  constructor(props) {
    super(props);
    this.next.bind(this);
    this.previous.bind(this);
  }

  next() {
    this.props.onNext();
  }

  previous() {
    this.props.onPrevious();
  }


  render() {
    var clickNext = this.next.bind(this);
    var clickPrev = this.previous.bind(this);

    return (

      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <p>Put  tag support here</p>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-6">
            <button onClick={clickPrev} type="button" class="btn btn-primary">Previous</button>
          </div>
          <div class="col-sm-6">
            <button onClick={clickNext} type="button" class="btn btn-primary">Next</button>
          </div>
        </div>
      </div>
    );
  }
}