import React, { Component } from "react";

import "./app.css";
import Review from './Review.js';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { shasums: null };
  }

  componentDidMount() {
    fetch("/ids")
      .then(res => res.json())
      .then(mediaIds => this.setState({ shasums: mediaIds }));
  }

  render() {
    return (
      <div>
        {this.state.shasums ? (
          <Review ids={this.state.shasums} />
        ) : (
          <h1>Loading image IDs.. please wait!</h1>
        )}
      </div>
    );
  }
}