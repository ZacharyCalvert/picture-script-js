import React, { Component } from "react";

import "./operations.css"

/*
TODO:
- This will be sloppy for now.  Goal will be to maintain all tags under allTags
and image tags under <idTags> so that back and forth are not atrocious for reload.
The todo is to clean this up down the road and build a class to manage this 
properly.

TODO: Reactive
When a new tag is submitted, we should receive an event that indicates a new
tag is added to the pool, this way multiple people/tabs can be interacting
and have a proper representation in the tag list.

TODO: 
Flag as human reviewed.  Next session should NOT retrieve human reviewed media.
 */

export default class Tagging extends Component {
  constructor(props) {
    super(props);
    this.state = {allTags: null, currentTags: null};
  }

  componentDidMount() {
    fetch("/entry/tags")
      .then(res => res.json())
      .then(tags => this.setState({ allTags: tags }));

    if (this.props.id) {
      this.loadCurrentId();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.id !== this.props.id) {
      this.loadCurrentId();
    }
  }

  reviewDone() {
    this.props.onNext();
  }

  addTagToArray(tag, array) {
    if (array) {
      if (!array.includes(tag)) {
        array.unshift(tag);
      }
    } else {
      array = [tag];
    }
    return array;
  }

  addTag(tag) {
    var state = {
      allTags: this.addTagToArray(tag, this.state.allTags), 
      currentTags: this.addTagToArray(tag, this.state.currentTags)
    };
    this.setState(state);
  }

  saveTags() {
    var activeTags = this.state.currentTags;
    if (activeTags === undefined) {
      activeTags = [];
    }
    console.log("Setting %s active tags: " + activeTags, this.props.id);
    console.log("Body: " + JSON.stringify(activeTags));
    fetch("/entry/tags/" + this.props.id, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(activeTags)
     }).then(res => this.reviewDone);
  }

  loadCurrentId() {
    if (this.props.id) {
      console.log("requesting " + this.props.id);

      fetch("/entry/tags/" + this.props.id)
        .then(res => res.json())
        .then(tags => this.setState({ active: tags }));
    }
  }

  handleInputKeyPress(e) {
    if (e.key === 'Enter' && e.target.value) {
      this.addTag(e.target.value);
    }
  }

  render() {

    var saveTags = this.saveTags.bind(this);

    return (

      <div class="container">
        {this.state.allTags ? (
          <div class="row">
            <div class="col-sm-12 col-md-12 col-lg-12">
            <label>Add Tag: <input tabIndex="1" type="text" name="tagInput" onKeyPress={this.handleInputKeyPress.bind(this)} />
            </label>
            </div>

            <div class="col-sm-12 col-md-12 col-lg-12">
              <button onClick={this.saveTags.bind(this)} type="button" class="btn btn-primary">Complete Tagging</button>
            </div>
          </div>
        ) : (
          <p>Loading tags</p>
        )}

          <div class="row">
            <div class="col-sm-12">
              <p>&nbsp;</p>
            </div>
          </div>
      </div>
    );
  }
}