import React, { Component } from 'react';
import '../css/RecipeList.css';

import Select from 'react-select';
import AsyncSelect from 'react-select/async';

import {countryOptions} from './SelectOptions.jsx';
import {dishOptions} from './SelectOptions.jsx';

const createOption = (label, id) => ({
  value: id,
  label
});

export default class RecipeList extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      message: 'Loading...',
      recipes: null,
      value: [],
      tags: [],
      ingredients: [],  
    }

    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleOriginChange = this.handleOriginChange.bind(this);
    this.onGetTag = this.onGetTag.bind(this);
    this.onChangeTags = this.onChangeTags.bind(this);
    this.onGetIngredient = this.onGetIngredient.bind(this);
  }

  componentDidMount() {
    fetch('/api/recipelist')
      .then(res => res.text())
      .then(res => 
        this.setState({
          recipes: JSON.parse(res),
          isLoading: false
        })
      );
  }

  handleTypeChange(option) {
    this.setState({type: option.value});
  }

  handleOriginChange(option) {
    this.setState({origin: option.label});
  }

  onChangeTags(newValue, actionMeta) {
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
  };

  onGetTag(value) {
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

  onChange(newValue, actionMeta) {
    this.setState({ 
      value: [],
      item: newValue 
    });

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
    this.openModal(newValue);
  };

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

  createItems(element) {
    return (
      <li className="row" key={element.title}></li>
    )
  }

  render() {    
    if (this.state.isLoading) {
      return <p>{this.state.message}</p>;
    }
    else {
      return (
        <div className="container">
          <div className="container-fluid container-create-recipe">
            <h1 className="headline">All Recipes</h1>
          
            <div className="filters row">
              <input type="text" className="form-control" placeholder="Suchen"/>
              <div className="more-search-options row">
                <Select
                  placeholder="-- Rezeptart --"
                  label="Single select"
                  options={dishOptions}
                  onChange={this.handleTypeChange}
                  className="search-recipe-input"
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      text: '#6a7989',
                      primary25: '#289fad',
                      primary: '#6a7989',
                    },
                  })}                  
                />

                <Select
                  placeholder="-- Herkunfsland --"
                  label="Single select"
                  onChange={this.handleOriginChange}
                  options={countryOptions}
                  className="search-recipe-input"
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      text: '#6a7989',
                      primary25: '#289fad',
                      primary: '#6a7989',
                    },
                  })}
                />

                <AsyncSelect
                  isMulti
                  isClearable
                  className="search-recipe-input"                
                  isDisabled={this.state.isLoading}
                  isLoading={this.state.isLoading}
                  backspaceRemoves={true}           
                  value={this.state.value}
                  loadOptions={this.onGetTag}
                  onChange={this.onChangeTags}
                  placeholder="-- Begriffe suchen --"
                />

                <AsyncSelect
                  isClearable
                  className="search-recipe-input"
                  isDisabled={this.state.isLoading}
                  isLoading={this.state.isLoading}
                  backspaceRemoves={true}           
                  value={this.state.value}
                  loadOptions={this.onGetIngredient}
                  onChange={this.onChangeIngredients}
                  placeholder="-- Zutaten suchen --"
                />
              </div>
            </div>

            <ul className="recipe-list">
            {
              this.state.recipes.map(function(recipe){
                return <li className="row" key={recipe._id}> {recipe.title} </li>;
              })
            }
            </ul>
          </div>
        </div>
      );
    }
  }
}