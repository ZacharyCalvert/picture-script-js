import 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { Component } from "react";

import "./app.css";
import Review from './Review.js';
import Operations from './Operations.js';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { shasums: null, current:undefined };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  componentDidMount() {
    fetch("/ids")
      .then(res => res.json())
      .then(mediaIds => this.setState({ shasums: mediaIds, current: 0 }));
  }

  next() {
    var activeId = this.state.current + 1;
    activeId = activeId > this.state.shasums.length - 1 ? 0 : activeId;
    this.setState(prevState => ({
      current: activeId
    }));
  }

  previous() {
    var activeId = this.state.current - 1;
    activeId = activeId < 0 ? this.state.shasums.length - 1 : activeId;
    this.setState(prevState => ({
      current: activeId
    }));
  }

  render() {
    return (
      <div class="row">
        <div class="col-sm-12 col-md-6">
          <Operations onNext={this.next} onPrevious={this.previous}/>
        </div>
        <div class="col-sm-12 col-md-6">
          {this.state.shasums ? (
            <Review currentId={this.state.current} ids={this.state.shasums} />
          ) : (
            <h1>Loading image IDs.. please wait!</h1>
          )}
        </div>
      </div>
    );
  }
}