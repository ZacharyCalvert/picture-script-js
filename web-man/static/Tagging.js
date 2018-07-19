import React, { Component } from "react";
import FolderOperations from "./FolderOperations.js"

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
    var done = {reviewDone: true};
    fetch("/entry/" + this.props.id, {
      method: 'PATCH',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(done)
     });
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
    console.log(array);
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
    var currentTags = this.state.currentTags;
    if (currentTags === undefined) {
      currentTags = [];
    }
    console.log("Setting %s active tags: " + currentTags, this.props.id);
    console.log("Body: " + JSON.stringify(currentTags));
    fetch("/entry/tags/" + this.props.id, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(currentTags)
     }).then(res => this.reviewDone());
  }

  loadCurrentId() {
    if (this.props.id) {
      console.log("requesting " + this.props.id);

      fetch("/entry/tags/" + this.props.id)
        .then(res => res.json())
        .then(tags => this.setState({ currentTags: tags }));
    }
  }

  handleInputKeyPress(e) {
    if (e.key === 'Enter' && e.target.value) {
      this.addTag(e.target.value);
    }
  }

  handleTagCheckboxChange(e) {
    if (e.target.checked) {
      this.addTag(e.target.value);
    } else {
      var currentTags = this.state.currentTags;
      currentTags = currentTags.filter((val) => val !== e.target.value);
      console.log(currentTags);
      this.setState({currentTags: currentTags});
    }
  }

  renderActiveTags() {
    if (this.state.currentTags) {
      const tagBoxes = this.state.currentTags.map((tag) => 

        <div class="row">
          <div class="col-sm-1">
              <input value={tag} type="checkbox" checked="true" onChange={this.handleTagCheckboxChange.bind(this)}/>
          </div>
          <div class="col-sm-11">
            <label class="float-left">{tag}</label>
          </div>
        </div>
      );
      return (
        <div class="container">{tagBoxes}</div>
      )
    } else {
      return (<div class="row"/>)
    }
  }

  renderInactiveTags() {
    if (this.state.allTags) {

      var toRender = this.state.allTags;
      var currentTags = this.state.currentTags;
      if (currentTags) {
        toRender = toRender.filter((val) => !currentTags.includes(val));
      }

      var checked = false;
      const tagBoxes = toRender.map((tag) => 

        <div class="row">
          <div class="col-sm-1">
              <input value={tag} type="checkbox" checked={checked} onChange={this.handleTagCheckboxChange.bind(this)}/>
          </div>
          <div class="col-sm-11">
            <label class="float-left">{tag}</label>
          </div>
        </div>
      );
      return (
        <div class="container">{tagBoxes}</div>
      )
    } else {
      return (<div class="row"/>)
    }
  }

  render() {

    return (

      <div class="container">
        {this.state.allTags ? (
          <div class="row">
            <div class="col-sm-12 col-md-12 col-lg-12">
            <label>Add Tag: <input tabIndex="1" type="text" name="tagInput" onKeyPress={this.handleInputKeyPress.bind(this)} />
            </label>
            </div>
          </div>
        ) : (<p/>) }

        {this.renderActiveTags()}
        {this.renderInactiveTags()}
        
        {this.state.allTags ? (
          <div class="row">
            <div class="col-sm-12 col-md-12 col-lg-12">
              <button onClick={this.saveTags.bind(this)} type="button" class="btn btn-primary">Done Tagging</button>
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

        <FolderOperations id={this.props.id} addTag={this.addTag.bind(this)} />
      </div>
    );
  }
}