import React, { Component } from "react";
import "./deletemedia.css"

export default class DeleteMedia extends Component {
  constructor(props) {
    super(props);
    this.state = {inProgress: false};
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.id !== this.props.id) {
      this.setState({inProgress: false});
    }
  }

  handleCancel() {
    this.setState({inProgress: false});
  }

  handleDeleteInitialButton() {
    this.setState({inProgress: true});
  }

  handleDelete() {
    fetch("/entry/" + this.props.id, {
      method: 'DELETE',
      headers: {'Content-Type':'application/json'}
     }).then(res => this.props.onNext());
  }

  render () {

    return (
      <div class="container top-buffer">
      { !this.state.inProgress ? 
        <div class="row">
          <div class="col-sm-12">
            <button onClick={this.handleDeleteInitialButton.bind(this)} type="button" class="btn btn-primary">Delete and Ignore Future Import</button>
          </div>
        </div>
        : 
        <div class="row">
          <div class="col-sm-6">
            <button onClick={this.handleDelete.bind(this)} type="button" class="btn warning">Delete</button>
          </div>
          <div class="col-sm-6">
            <button onClick={this.handleCancel.bind(this)} type="button" class="btn btn-primary">Cancel</button>
          </div>
        </div>
      }
      </div>
    )
  }
}