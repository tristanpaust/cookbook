import React, { Component } from "react"; 
//import AsyncSelect from 'react-select/async';
import AsyncCreatableSelect from 'react-select/async-creatable';

const createOption = (label) => ({
  label,
  value: label.toLowerCase().replace(/\W/g, ''),
});

export default class SearchTag extends Component {

  constructor() {
    super();
    this.state = {
      isLoading: false,
      value: undefined,
    }
    this.onChange = this.onChange.bind(this);
    this.onGetTag = this.onGetTag.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

   onChange(newValue, actionMeta) {
    console.group('Value Changed');
    console.log(newValue);
    console.log('action:', actionMeta.action);
    console.groupEnd();
    this.setState({ value: newValue });
  };

  handleCreate(inputValue) {
    this.setState({ isLoading: true });
      
    fetch('/api/savetag', {
      method: 'POST',
      body: JSON.stringify({title: inputValue}),
      headers: {
        'Content-Type': 'application/json'        }
    })
    .then(res => res.text())
    .then(newOption => {
      var tag = JSON.parse(newOption);
      var option = createOption(tag.title);
      this.setState({
        isLoading: false,
        value: option
      });
    })
  }

  onGetTag(value) { console.log(value);
    if (!value) {
      return Promise.resolve({ options: [] });
    }

    return fetch('/api/searchtag?q='+value, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },      
    })
    .then((response) => {
      return response.json();
    })
    .then((json) => {console.log(json)
      const formatted = json.map((l) => {
        return Object.assign({}, {
          value: l._id,
          label: l.title
        });
      })
      return formatted;
    })
  }

  render() {
    return (
      <div className="form-control">
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
        />
       </div>
    );
  }
};
