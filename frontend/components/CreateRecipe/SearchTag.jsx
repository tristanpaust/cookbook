import React, { Component } from "react"; 
import '../../global.jsx'

import AsyncCreatableSelect from 'react-select/async-creatable';


const createOption = (label, id) => ({
  value: id,
  label
});

export default class SearchTag extends Component {

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
      
    const newOption = await (global.FetchWithHeaders('POST', 'api/savetag', {title: inputValue}))

    var tag = newOption;
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
    const response = await (global.FetchWithHeaders('GET', 'api/searchtag?q=' + value))

    const formatted = response.map((l) => {
      return Object.assign({}, {
        value: l._id,
        label: l.title
      });
    })
    return formatted;
  }

  render() {
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
          placeholder="-- Bitte mindestens 3 Begriffe auswählen --"
        />
       </div>
    );
  }
};
