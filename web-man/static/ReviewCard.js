import React, { Component } from "react";

import MetaList from './MetaList.js';
import Media from './Media.js';

var dateFormat = require('dateformat');

export default class ReviewCard extends Component {
  constructor(props) {
    super(props);
    this.state = { entry: null };
  }

  componentDidMount() {
    console.log("Fetching /ids/" + this.props.id)
    fetch("/ids/" + this.props.id)
      .then(res => res.json())
      .then(media => this.setState({ entry: media }));
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.id !== this.props.id) {
      console.log("Fetching /ids/" + this.props.id)
      fetch("/ids/" + this.props.id)
        .then(res => res.json())
        .then(media => this.setState({ entry: media }));
    }
  }

  render() {

    const entry = this.state.entry;
    const dateStr = entry ? dateFormat(entry.earliestDate, "dddd, mmmm dS, yyyy, HH:MM") : undefined;
    return (
      <div>
        {this.state.entry ? (
          <div>
            <Media id={this.props.id} ext={entry.extensions[0]} path={entry.storedAt} />
            <p class="text-left">Date: {dateStr}</p>
            <p class="text-left">
              Known file paths: 
              <MetaList name={"paths"} list={entry.paths} />
            </p>
            <p class="text-left">
              Sha256: {this.props.id}
            </p>
          </div>
        ) : (
          <h1>Loading media..</h1>
        )}
      </div>
    );
  }
}