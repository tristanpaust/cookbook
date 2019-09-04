import React, { Component } from 'react';
import '../css/RecipeList.css';

import Select from 'react-select';
import AsyncSelect from 'react-select/async';

import {countryOptions} from './SelectOptions.jsx';
import {dishOptions} from './SelectOptions.jsx';

import { NavLink } from 'react-router-dom';

import RecipeGrid from './RecipeGrid.jsx';

const createOption = (label, id) => ({
  value: id,
  label
});

export default class RecipeList extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      isFetchingData: true,
      message: 'Loading...',
      recipes: null,
      tagValue: [],
      ingredientValue: [],
      recipeType: '',
      origin: '',
      tags: [],
      ingredients: [],
      originValue: '',
      recipeTypeValue: ''
    }

    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleOriginChange = this.handleOriginChange.bind(this);
    this.onGetTag = this.onGetTag.bind(this);
    this.onChangeSearchField = this.onChangeSearchField.bind(this);
    this.onChangeTags = this.onChangeTags.bind(this);
    this.onGetIngredient = this.onGetIngredient.bind(this);
    this.onChangeIngredient = this.onChangeIngredient.bind(this);
    this.onSearchRecipe = this.onSearchRecipe.bind(this);
    this.onClearSearch = this.onClearSearch.bind(this);
    this.getCourseTypeName = this.getCourseTypeName.bind(this);
  }

  componentDidMount() {
    fetch('/api/recipelist')
      .then(res => res.text())
      .then(res => 
        this.setState({
          isFetchingData: false,
          recipes: JSON.parse(res),
          isLoading: false
        })
      );
  }

  handleTypeChange(newValue, actionMeta) {
    this.setState({ 
      recipeTypeValue: newValue
    });
    
    if (actionMeta.action === "select-option") {
      // Add the ingredient to the array that keeps track of all ids
        this.setState({
          recipeType: newValue.value
        });
      }
    if (actionMeta.action === "clear") {
      this.setState({
        recipeType: '',
      });
    }
  }

  handleOriginChange(newValue, actionMeta) {
    this.setState({ 
      originValue: newValue
    });
    
    if (actionMeta.action === "select-option") {
      // Add the ingredient to the array that keeps track of all ids
        this.setState({
          origin: newValue.value
        });
      }
    if (actionMeta.action === "clear") {
      this.setState({
        origin: '',
      });
    }  
  }

  onChangeSearchField(e) {
    this.setState({searchString: e.target.value});
  }

  onChangeTags(newValue, actionMeta) {
    this.setState({ tagValue: newValue });

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

  onChangeIngredient(newValue, actionMeta) {
    this.setState({ 
      ingredientValue: newValue 
    });

    if (actionMeta.action === "select-option") {
      // Add the ingredient to the array that keeps track of all ids
      this.state.ingredients.push(newValue[newValue.length-1].value);
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

  onSearchRecipe(e) {
    e.preventDefault();
    let searchQuery = {
      searchString: this.state.searchString,
      recipeType: this.state.recipeType,
      origin: this.state.origin,
      tags: this.state.tags,
      ingredients: this.state.ingredients,
    };

    this.setState({isFetchingData: true});

    return fetch('/api/searchrecipe?q=' + JSON.stringify(searchQuery), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      this.setState({ 
        recipes : json,
        isFetchingData: false
      });
    })
  }

  onClearSearch(e) {
    e.preventDefault();
    this.setState(
      {
        tagValue: [],
        ingredientValue: [],
        recipeType: '',
        origin: '',
        tags: [],
        ingredients: [],
        recipeTypeValue: '',
        originValue: ''
      }
    );
    this.refs.searchField.value = '';
    this.componentDidMount();
  }

  getCourseTypeName(courseType) {
    if (courseType === 'starter' ) {
      return "Vorspeise";
    }
    if (courseType === 'main' ) {
      return "Hauptspeise";
    }
    if (courseType === 'dessert' ) {
      return "Nachspeise";
    }
    if (courseType === 'side' ) {
      return "Beilage";
    }
    if (courseType === 'sauce' ) {
      return "Sauce/Dressing";
    }    
  }

  render() {    
    if (this.state.isLoading) {
      return <p>{this.state.message}</p>;
    }
    else {
      if (this.state.isFetchingData) {
        const spinner = document.getElementById('spinner');
        if (spinner && !spinner.hasAttribute('hidden')) {
          spinner.classList.remove('hidden');
        }
      }
      if (!this.state.isFetchingData) {
        const spinner = document.getElementById('spinner');
        if (spinner && !spinner.hasAttribute('hidden')) {
          spinner.classList.add('hidden');
        }
      }
      return (
        <div className="container">

          <div className="container-fluid container-create-recipe">
            <h1 className="headline">Alle Rezepte</h1>
          
            <form>
              <div className="filters row">
                <input type="text" className="form-control search-recipe-text-input" placeholder="Suchen" onChange={this.onChangeSearchField} ref="searchField"/>
                <div className="more-search-options row">
                  <div className="col">
                    <Select
                      isClearable
                      label="Single select"
                      options={dishOptions}
                      onChange={this.handleTypeChange}
                      className="search-recipe-input"
                      value={this.state.recipeTypeValue}
                      placeholder="-- Rezeptart --"
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
                  </div>

                  <div className="col">
                    <Select
                      isClearable
                      placeholder="-- Herkunfsland --"
                      label="Single select"
                      onChange={this.handleOriginChange}
                      options={countryOptions}
                      className="search-recipe-input"
                      value={this.state.originValue}
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
                  </div>
                                  
                  <div className="col">
                    <AsyncSelect
                      isMulti
                      isClearable
                      className="search-recipe-input"                
                      isDisabled={this.state.isLoading}
                      isLoading={this.state.isLoading}
                      backspaceRemoves={true}           
                      value={this.state.tagValue}
                      loadOptions={this.onGetTag}
                      onChange={this.onChangeTags}
                      placeholder="-- Begriffe suchen --"
                    />
                  </div>

                  <div className="col">
                    <AsyncSelect
                      isMulti
                      isClearable
                      className="search-recipe-input"
                      isDisabled={this.state.isLoading}
                      isLoading={this.state.isLoading}
                      backspaceRemoves={true}     
                      value={this.state.ingredientValue}
                      loadOptions={this.onGetIngredient}
                      onChange={this.onChangeIngredient}
                      placeholder="-- Zutaten suchen --"
                    />
                  </div>
                </div>

                <div className="search-recipe-buttons">
                  <button className="btn btn-success btn-search-recipe" type="submit" onClick={this.onSearchRecipe}>
                    <span className="oi oi-magnifying-glass"></span>
                  </button>
                  <button className="btn btn-success btn-clear-recipe" onClick={this.onClearSearch}>
                    <span className="oi oi-reload"></span>
                  </button>
                </div>

              </div>
            </form>

            <hr/>

            <div className="d-flex justify-content-center hidden" id="spinner">
              <div className="spinner-border" role="status">
                <span className="sr-only">Laden...</span>
              </div>
            </div>

            <ul className="recipe-list">
            { 
              this.state.recipes.map(function(recipe){
                 function getCourseTypeName(courseType) {
                  if (courseType === 'starter' ) {
                    return "Vorspeise";
                  }
                  if (courseType === 'main' ) {
                    return "Hauptspeise";
                  }
                  if (courseType === 'dessert' ) {
                    return "Nachspeise";
                  }
                  if (courseType === 'side' ) {
                    return "Beilage";
                  }
                  if (courseType === 'sauce' ) {
                    return "Sauce/Dressing";
                  }    
                }
                return <li className="row recipe-list-item" key={recipe._id}>
                    <div className="col recipe-name align-self-center">{recipe.title}</div>
                    <div className="col align-self-center">{recipe.origin}</div>
                    <div className="col align-self-center">{getCourseTypeName(recipe.formType)}</div>
                    <div className="col recipe-item-buttons"><NavLink to={'/recipe/view/' + recipe._id}><button className="btn btn-success view"><span className="oi oi-eye"></span></button></NavLink><NavLink to={'/recipe/edit/' + recipe._id}><button className="btn btn-success edit"><span className="oi oi-wrench"></span></button></NavLink><button className="btn btn-success delete"><span className="oi oi-x"></span></button></div>
                  </li>;
              })
            }
            </ul>
                  //<RecipeGrid entries={this.state.recipes}/>

          </div>
        </div>
      );
    }
  }
}