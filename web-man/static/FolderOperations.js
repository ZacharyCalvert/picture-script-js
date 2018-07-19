import React, { Component } from "react";

import "./operations.css"

export default class FolderOperations extends Component {
  constructor(props) {
    super(props);
    this.state = {paths: null, folder: null};
  }

  componentDidMount() {
    fetch("/ids/" + this.props.id)
      .then(res => res.json())
      .then(media => {console.log(media.paths); this.setState({ paths: media.paths })});
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.id !== this.props.id) {
      this.setState({folder: null});
      fetch("/ids/" + this.props.id)
        .then(res => res.json())
        .then(media => {console.log(media.paths); this.setState({ paths: media.paths })});
    }
  }

  handleRadioChange(e) {
    this.setState({folder: e.target.value});
  }

  handleFolderInputChange(e) {
    this.setState({folder: e.target.value});
  }

  renderFolderOptions() {
    console.log(this.state.paths);
    if (this.state.paths && this.state.paths.length > 0) {
      var paths = this.state.paths;
      var parentFolders = new Set();
      for (var path of paths) {
        var splitPath = path.split('/');
        splitPath.pop();
        parentFolders.add(splitPath.pop());
      }
      var folders = Array.from(parentFolders);

      if (folders.length > 1) {
        const radioOptions = folders.map((folder) => 

          <div class="row">
            <div class="col-sm-1">
                <input value={folder} type="radio" checked={this.state.folder === folder}  onChange={this.handleRadioChange.bind(this)}/>
            </div>
            <div class="col-sm-11">
              <label class="float-left">{folder}</label>
            </div>
          </div>
        );

        if (this.state.folder === null) {
          this.setState({folder: folders[0]});
        }

        return (
          <div class="container">
            <div class="row">
              <div class="col-sm-12">
                <hr/>
              </div>
              <div class="col-sm-12">
                <h3>Folder Management</h3>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12">
                <label>Folder:</label>
                <input value={this.state.folder} type="text" onChange={this.handleFolderInputChange.bind(this)}/>
              </div>
            </div>
              {radioOptions}
          </div>
        )
      } else {
        return (
          <div class="row">
            <div class="col-sm-12">
              <hr/>
            </div>
            <div class="col-sm-12">
              <h3>Folder Management</h3>
            </div>
            <div class="col-sm-12">
              <label>Folder:</label>
              <input value={folders[0]} type="text" onChange={this.handleFolderInputChange.bind(this)}/>
            </div>
          </div>
        )
      }
    } else {
      return (<div class="row"/>)
    }
  }

  render() {

    return (
      <div class="container">
        {this.renderFolderOptions()}
      </div>
    );
  }
}