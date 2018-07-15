import React, { Component } from "react";

import MetaList from './MetaList.js';
import Media from './Media.js';
/*
{"sha256":"C28C3EDC10494AD4A5E0D235240A51883B58E416F2724C74668A85A31AB79D19",
"paths":["/Users/Zach/Desktop/BdayPresent/Bobsburgerswithdog.png"],
"extensions":["PNG"],
"earliestDate":1529762242949,
"storedAt":"C/2/C28C3EDC10494AD4A5E0D235240A51883B58E416F2724C74668A85A31AB79D19.PNG"}
*/

export default class ReviewCard extends Component {
  constructor(props) {
    super(props);
    this.state = { entry: null };
  }

  componentDidMount() {
    fetch("/ids/" + this.props.id)
      .then(res => res.json())
      .then(media => this.setState({ entry: media }));
  }

  render() {
    const entry = this.state.entry;
    return (
      <div>
        {this.state.entry ? (
          <div>
            <Media ext={entry.extensions[0]} path={entry.storedAt} />
            Date:{new Date(entry.earliestDate).toString()}
            Known file paths:
            <MetaList name={"paths"} list={entry.paths} />
          </div>
        ) : (
          <h1>Loading media..</h1>
        )}
      </div>
    );
  }
}