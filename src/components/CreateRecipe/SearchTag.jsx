import React, { Component } from "react"; 
import AsyncSelect from 'react-select/async';

export default class SearchTag extends Component {
  constructor() {
    super();
    this.state = {
      value: {}
    }
    this.onChange = this.onChange.bind(this);
    this.onGetTag = this.onGetTag.bind(this);

  }
 
  onChange = (value) => {
    this.setState({
        value: value
    })
  }

  onGetTag(value) { console.log(value)
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
      <div className="form-control">
        <AsyncSelect
          value={this.state.value}
          loadOptions={this.onGetTag}
          placeholder="Enter Model"
          onChange={this.onChange}
          isMulti
        />
       </div>
    );
  }
};