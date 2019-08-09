import React, { Component } from "react"; 
//import AsyncSelect from 'react-select/async';
import AsyncCreatableSelect from 'react-select/async-creatable';

const createOption = (label) => ({
  label,
  value: label.toLowerCase().replace(/\W/g, ''),
});

export default class SearchUnit extends Component {

  constructor() {
    super();
    this.state = {
      isLoading: false,
      value: undefined,
    }
    this.onChange = this.onChange.bind(this);
    this.onGetUnit = this.onGetUnit.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

   onChange(newValue, actionMeta) {
    this.setState({ value: newValue });
    this.props.onSelectUnit(newValue);
  };

  handleCreate(inputValue) {
    this.setState({ isLoading: true });
      
    fetch('/api/saveunit', {
      method: 'POST',
      body: JSON.stringify({title: inputValue}),
      headers: {
        'Content-Type': 'application/json'        }
    })
    .then(res => res.text())
    .then(newOption => {
      var unit = JSON.parse(newOption);
      var option = createOption(unit.title);
      this.setState({
        isLoading: false,
        value: this.state.value,
      });
    })
  }

  onGetUnit(value) {
    if (!value) {
      return Promise.resolve({ options: [] });
    }

    return fetch('/api/searchunit?q='+value, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },      
    })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
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
      <div className="async-unit-control col">
        <AsyncCreatableSelect
          isClearable
          isDisabled={this.state.isLoading}
          isLoading={this.state.isLoading}
          backspaceRemoves={true}           
          value={this.state.value}
          loadOptions={this.onGetUnit}
          onChange={this.onChange}
          onCreateOption={this.handleCreate}
        />
       </div>
    );
  }
};
