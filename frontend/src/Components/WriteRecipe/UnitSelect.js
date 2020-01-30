import React, { Component } from "react"; 
import APIClient from '../../Actions/apiClient';

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

  async componentDidMount() {
    this.apiClient = new APIClient();
  }

  onChange(newValue, actionMeta) {
    this.setState({ value: newValue });
    this.props.onSelectUnit(newValue);
  };

  async handleCreate(inputValue) {
    this.setState({ isLoading: true });

    const newOption = await (this.apiClient.createUnit({title: inputValue}));  

    var option = createOption(newOption.data.title, newOption.data._id);
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

    const response = await (this.apiClient.searchUnit(value));
    console.log(response)
    const formatted = response.data.map((l) => {
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
          placeholder={this.props.searchPlaceholder}
        />
       </div>
    );
  }
};