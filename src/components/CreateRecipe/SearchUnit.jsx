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
      units: []
    }
    this.onChange = this.onChange.bind(this);
    this.onGetUnit = this.onGetUnit.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

   onChange(newValue, actionMeta) {
    this.setState({ value: newValue });

    if (actionMeta.action === "select-option") { 
      // Add the unit to the array that keeps track of all ids
      this.state.units.push(newValue[newValue.length-1].value);
    }
    
    if (actionMeta.action === "remove-value" || actionMeta.action === "pop-value") {
      // calculates diff between old and new list
      var index = 0;
      
      if (newValue) {
        let difference = this.state.value.filter(x => !newValue.includes(x)); 
        index = this.state.units.indexOf(difference[0].value); 
      }
      // Get index of removed item in units array
      if (index > -1) {
        // Remove the unit
        this.state.units.splice(index, 1); 
      }
    }
    this.props.onSelectUnit(this.state.units);
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
      this.state.value.push(option);
      this.state.units.push(unit._id);
      this.setState({
        isLoading: false,
        value: this.state.value
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
      <div className="async-unit-control">
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
