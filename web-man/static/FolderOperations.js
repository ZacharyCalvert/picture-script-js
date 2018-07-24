import React, { Component } from "react";

import "./operations.css"
import ExclusionOperations from "./ExclusionOperations";

export default class FolderOperations extends Component {
  constructor(props) {
    super(props);
    this.state = {folderTag:"", entry: null, updatedCount:null, paths: null, folder: null};
  }

  componentDidMount() {
    fetch("/ids/" + this.props.id)
      .then(res => res.json())
      .then(media => {this.setState({ folder:null, entry: media, paths: media.paths })});
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.id !== this.props.id) {
      this.setState({folder: null, updatedCount: null, folderTag: ""});
      fetch("/ids/" + this.props.id)
        .then(res => res.json())
        .then(media => {this.setState({ folder:null, entry: media, paths: media.paths })});
    }
  }

  handleRadioChange(e) {
    this.setState({folder: e.target.value});
  }

  handleFolderInputChange(e) {
    this.setState({folder: e.target.value});
  }

  submitFolderTag() {
    var tagRequest = {folder: this.state.folder, tag: this.state.folderTag};
    fetch("/entry", {
      method: 'PATCH',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(tagRequest)
     })
     .then(res => res.json())
     .then(meta => {this.setState({ updatedCount: meta.tagsApplied })});
    this.props.addTag(this.state.folderTag);
  }

  renderTaggedFolderStats() {
    if (this.state.updatedCount !== null) {
      return (
        <div class="row">
          <div class="col-12">
            <p>{this.state.updatedCount} matches updated.</p>
          </div>
        </div>
        )
    } else {
      return (<div class="row"/>)
    }
  }

  renderFolderOptions() {
    if (this.state.paths && this.state.paths.length > 0) {
      var paths = this.state.paths;
      var parentFolders = new Set();
      for (var path of paths) {
        var splitPath = path.split('/');
        splitPath.pop();
        parentFolders.add(splitPath.pop());
      }
      var folders = Array.from(parentFolders);

      if (this.state.folder === null) {
        this.setState({folder: folders[0]});
      }

      if (folders.length > 1) {
        const radioOptions = folders.map((folder) => 

          <div class="row">
            <div class="col-6">
                <input class="float-right" value={folder} type="radio" checked={this.state.folder === folder}  onChange={this.handleRadioChange.bind(this)}/>
            </div>
            <div class="col-6">
              <label class="float-left">{folder}</label>
            </div>
          </div>
        );

        return (
          <div class="container">
            <div class="row">
              <div class="col-6">
                <label class="float-right">Folder:</label>
              </div>
              <div class="col-6">
                <label class="float-left">{this.state.folder}</label>
              </div>
            </div>
              {radioOptions}
          </div>
        )
      } else {
        return (
          <div class="row">
          <div class="col-6">
              <label class="float-right">Folder:</label>
          </div>
            <div class="col-6">
              <label class="float-left">{this.state.folder}</label>
            </div>
          </div>
        )
      }
    } else {
      return (<div class="row"/>)
    }
  }

  handleTagChange(e) {
    this.setState({folderTag: e.target.value});
  }

  handleTagKeyPress(e) {
    if (e.key === 'Enter' && e.target.value) {
      this.submitFolderTag();
    }
  }

  render() {
    return (
      <div class="container">
        <div class="row">
          <div class="col-12">
            <hr/>
          </div>
          <div class="col-12">
            <h3>Folder Management</h3>
          </div>
        </div>
        {this.renderFolderOptions()}
        <div class="row">
          <div class="col-6">
            <label class="float-right">Tag:</label>
          </div>
          <div class="col-6">
            <input class="float-left" value={this.state.folderTag} type="text" name="tagFolder" onKeyPress={this.handleTagKeyPress.bind(this)} onChange={this.handleTagChange.bind(this)}/>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            &nbsp;
          </div>
        </div>
        <div class="container">
          <div class="row">
            <div class="col-12">
              <button onClick={this.submitFolderTag.bind(this)} type="button" class="btn btn-primary">Tag Folder</button>
            </div>
          </div>
        </div>
        {this.renderTaggedFolderStats()}

        {this.state.entry ?
          <ExclusionOperations entry={this.state.entry} selectedFolder={this.state.folder}/>
          : 
          <div class="row"/>
        }
      </div>
    );
  }
}