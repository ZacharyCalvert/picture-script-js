import React, { Component } from "react";

import Autocomplete from 'react-autocomplete';
// import Select from 'react-select';

import "./tagsearch.css"

export default class TagSearch extends Component {

  constructor(props) {
    super(props);

    /*
    props:
      activateTag
      deactivateTag
      activeTags
      allTags
      id
    state:
      searchText
    */

    this.state = {searchText: ""};
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.id !== this.props.id) {
      this.setState({searchText: ""});
    }
  }

  getTagsForSearch() {
    if (!this.state.searchText) {
      return [];
    }
    if (this.props.allTags) {
      var searchLower = this.state.searchText.toLowerCase();
      var matching = this.props.allTags.filter(tag => tag.toLowerCase().includes(searchLower));
      if (!matching.includes(this.state.searchText)) {
        matching.unshift(this.state.searchText);
      }

      return matching.map(function(tag) {
        return { value: tag, label: tag };
      });

    } else {
      return [];
    }
  }

  searchChanged(e) {
    this.setState({searchText: e.target.value});
    return e.target.value;
  }

  selectFromSearch(value) {
    if (this.props.activeTags.includes(value)) {
      this.props.deactivateTag(value);
    } else {
      this.props.activateTag(value);
    }
    this.setState({searchText: ""});
  }

  renderItem(item, isHighlighted) {
    var dropdownClass;
    if (isHighlighted) {
      dropdownClass="menu-highlight";
    } else if (this.props.activeTags.includes(item.label)) {
      dropdownClass="menu-active";
    } else { 
      dropdownClass="menu-inactive";
    }
    return (
      <div class={dropdownClass}>
        {item.label}
      </div>
    );
  }

  render() {
    return ( 
      <Autocomplete getItemValue={(tag) => tag.label} items={this.getTagsForSearch()} renderItem={this.renderItem.bind(this)} value={this.state.searchText} onChange={this.searchChanged.bind(this)} onSelect={this.selectFromSearch.bind(this)} />
    )
  }
}