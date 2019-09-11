import React, { Component } from "react"; 
import '../../global.jsx'

import AsyncCreatableSelect from 'react-select/async-creatable';

const createOption = (label, id) => ({
  value: id,
  label
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

  async handleCreate(inputValue) {
    this.setState({ isLoading: true });

    const newOption = await (global.FetchWithHeaders('POST', 'api/saveunit', {title: inputValue}))

    var option = createOption(newOption.title, newOption._id);
    this.setState({
      isLoading: false,
      value: option,
    });  
    this.props.onSelectUnit(option);
  }

  async onGetUnit(value) {
    if (!value) {
      return Promise.resolve({ options: [] });
    }

    const response = await (global.FetchWithHeaders('GET', 'api/searchunit?q=' + value))

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
          placeholder="kg, ml, Stück, usw."
        />
       </div>
    );
  }
};
