import React, { Component } from "react"; 

import AsyncCreatableSelect from 'react-select/async-creatable';
import APIClient from '../../Actions/apiClient';

import { withTranslation } from 'react-i18next';
import i18n from "i18next";

const createOption = (label, id) => ({
  value: id,
  label
});

export default class TagSelect extends Component {

  constructor() {
    super();
    this.state = {
      isLoading: false,
      value: [],
      tags: []
    }
    this.onChange = this.onChange.bind(this);
    this.onGetTag = this.onGetTag.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  async componentDidMount() {
      this.apiClient = new APIClient();
      console.log(this.props)
  }

   onChange(newValue, actionMeta) {
    this.setState({ value: newValue });

    if (actionMeta.action === "select-option") { 
      // Add the tag to the array that keeps track of all ids
      this.state.tags.push(newValue[newValue.length-1].value);
    }
    
    if (actionMeta.action === "remove-value" || actionMeta.action === "pop-value") {
      // calculates diff between old and new list
      var index = 0;
      
      if (newValue) {
        let difference = this.state.value.filter(x => !newValue.includes(x)); 
        index = this.state.tags.indexOf(difference[0].value);
      }
      // Get index of removed item in tags array
      if (index > -1) {
        // Remove the tag
        this.state.tags.splice(index, 1); 
      }
    }
    this.props.onSelectTag(this.state.tags);
  };

  async handleCreate(inputValue) {
    this.setState({ isLoading: true });
    
    const newOption = await (this.apiClient.createTag({title: inputValue}));  
    
    var tag = newOption.data;
    var option = createOption(tag.title, tag._id);
    this.state.value.push(option);
    this.state.tags.push(tag._id);
    this.setState({
      isLoading: false,
      value: this.state.value
    });
  }

  async onGetTag(value) {
    if (!value) {
      return Promise.resolve({ options: [] });
    }
    const response = await (this.apiClient.searchTag(value));

      const formatted = response.data.map((l) => {
        return Object.assign({}, {
          value: l._id,
          label: l.title
        });
      })
      return formatted;
  }

  render() {
    let placeholderText = this.props.searchPlaceholder;
    console.log(placeholderText)
    return (
      <div className="async-tag-control">
        <AsyncCreatableSelect
          isMulti
          isClearable
          isDisabled={this.state.isLoading}
          isLoading={this.state.isLoading}
          backspaceRemoves={true}           
          value={this.state.value}
          loadOptions={this.onGetTag}
          onChange={this.onChange}
          onCreateOption={this.handleCreate}
          placeholder={placeholderText}
        />
       </div>
    );
  }
};