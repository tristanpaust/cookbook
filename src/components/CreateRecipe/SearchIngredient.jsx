import React, { Component } from "react"; 
//import AsyncSelect from 'react-select/async';
import AsyncCreatableSelect from 'react-select/async-creatable';

const createOption = (label) => ({
  label,
  value: label.toLowerCase().replace(/\W/g, ''),
});

export default class SearchIngredient extends Component {

  constructor() {
    super();
    this.state = {
      isLoading: false,
      value: undefined,
      ingredients: []
    }
    this.onChange = this.onChange.bind(this);
    this.onGetIngredient = this.onGetIngredient.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

   onChange(newValue, actionMeta) {
    this.setState({ value: null });

    if (actionMeta.action === "select-option") { 
      // Add the ingredient to the array that keeps track of all ids
      this.state.ingredients.push(newValue);
    }
    
    if (actionMeta.action === "remove-value" || actionMeta.action === "pop-value") {
      // calculates diff between old and new list
      var index = 0;
      
      if (newValue) {
        let difference = this.state.value.filter(x => !newValue.includes(x)); 
        index = this.state.ingredients.indexOf(difference[0].value); 
      }
      // Get index of removed item in ingredients array
      if (index > -1) {
        // Remove the ingredient
        this.state.ingredients.splice(index, 1); 
      }
    }
    this.props.onSelectIngredient(this.state.ingredients);
  };

  handleCreate(inputValue) {
    this.setState({ isLoading: true });
      
    fetch('/api/saveingredient', {
      method: 'POST',
      body: JSON.stringify({title: inputValue}),
      headers: {
        'Content-Type': 'application/json'        }
    })
    .then(res => res.text())
    .then(newOption => {console.log(newOption);
      var ingredient = JSON.parse(newOption);
      var option = createOption(ingredient.title);
      this.state.value.push(option);
      this.state.ingredients.push(ingredient._id);
      this.setState({
        isLoading: false,
        value: this.state.value
      });
    })
  }

  onGetIngredient(value) {
    if (!value) {
      return Promise.resolve({ options: [] });
    }

    return fetch('/api/searchingredient?q='+value, {
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
      <div className="async-ingredient-control">
        <AsyncCreatableSelect
          isClearable
          isDisabled={this.state.isLoading}
          isLoading={this.state.isLoading}
          backspaceRemoves={true}           
          value={this.state.value}
          loadOptions={this.onGetIngredient}
          onChange={this.onChange}
          onCreateOption={this.handleCreate}
        />
       </div>
    );
  }
};
