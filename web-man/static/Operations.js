import React, { Component } from "react";

import "./operations.css"

import Tagging from "./Tagging.js"

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
            <Tagging onNext={clickNext} id={this.props.currentId}/>
          </div>
        </div>
      </div>
    );
  }
}