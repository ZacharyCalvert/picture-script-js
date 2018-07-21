import React, { Component } from "react";

import "./exclusionoperations.css"

export default class ExclusionOperations extends Component {
  constructor(props) {
    super(props); // entry, selectedFolder

    // state
    // fileExcluded: if the file excluded checkbox is currently checked
    // updatedCount: how many were updated or null
    // excludeFolder: whether or not the next request to the folder exclusion is to be true/false
    this.state = {fileExcluded: this.props.entry.excludeFromExport, updatedCount: null, excludeFolder: true};
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.entry.sha256 !== this.props.entry.sha256) {
      this.setState({updatedCount: null, excludeFolder: true, fileExcluded: this.props.entry.excludeFromExport});
    }
  }

  excludeFolder() {
    var exclusionRequest = {folder: this.props.selectedFolder, excludeFromExport: this.state.excludeFolder};
    fetch("/entry", {
      method: 'PATCH',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(exclusionRequest)
     })
     .then(res => res.json())
     .then(meta => {this.setState({ fileExcluded: this.state.excludeFolder, excludeFolder: !this.state.excludeFolder, updatedCount: meta.count })});
  }

  renderStats() {
    if (this.state.updatedCount !== null) {
      return (
        <div class="row">
          <div class="col-sm-12">
            <p>{this.state.updatedCount} matches updated.</p>
          </div>
        </div>
        )
    } else {
      return (<div class="row"/>)
    }
  }

  handleExcludeCheckboxEvent(e) {
    console.log("Checkbox event received: " + e.target.checked)
    console.log("Phoning to /entry/" + this.props.entry.sha256)
    if (e.target.checked) {
      fetch("/entry/" + this.props.entry.sha256, {
        method: 'PATCH',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({excludeFromExport: true})
       })
       .then(res => this.setState({ updatedCount: null, fileExcluded: true}));
    } else {
      
      fetch("/entry/" + this.props.entry.sha256, {
        method: 'PATCH',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({excludeFromExport: false})
       })
       .then(res => this.setState({ updatedCount: null, fileExcluded: false}));
    }
  }

  render() {

    return (
      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <hr/>
          </div>
          <div class="col-sm-12">
            <h3>Export Exclusion</h3>
          </div>
          <div class="col-sm-12">
            <input type="checkbox" checked={this.state.fileExcluded} onChange={this.handleExcludeCheckboxEvent.bind(this)}/>
            <label>Exclude Media from Export</label>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 col-md-12 col-lg-12">
            {this.state.excludeFolder ? 
              <button onClick={this.excludeFolder.bind(this)} type="button" class="btn btn-primary">Exclude Folder from Export</button>
            :
              <button onClick={this.excludeFolder.bind(this)} type="button" class="btn btn-primary">Undo Exclude Folder</button>
            }
          </div>
        </div>
        {this.renderStats()}
      </div>
    );
  }
}