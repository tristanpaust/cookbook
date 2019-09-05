import React, { Component } from 'react';
import '../../css/SearchBar.css';

import {dishOptions, countryOptions} from '../SelectOptions.jsx';

import Select from 'react-select';
import AsyncSelect from 'react-select/async';

export default class SearchBar extends Component {
  constructor() {
    super();    
    this.state = {
      originValue: '',
      typeValue: '',

      searchFieldValue: '',
      typeFieldValue: '',
      originFieldValue: '',

      showMoreOptions: false,

      tagValue: [],
      ingredientValue: [],
      tags: [],
      ingredients: [] 
    };

    this.onChangeSearchField = this.onChangeSearchField.bind(this);
    this.onChangeTypeField = this.onChangeTypeField.bind(this);
    this.onChangeOriginField = this.onChangeOriginField.bind(this);

    this.toggleMoreOptions = this.toggleMoreOptions.bind(this);

    this.onGetTag = this.onGetTag.bind(this);
    this.onChangeTags = this.onChangeTags.bind(this);
    this.onGetIngredient = this.onGetIngredient.bind(this);
    this.onChangeIngredient = this.onChangeIngredient.bind(this);

    this.onSearchRecipe = this.onSearchRecipe.bind(this);
    this.onClearSearch = this.onClearSearch.bind(this);
  }
  
  onChangeSearchField(e) {
    if (this.state.searchFieldValue !== e.target.value) {
        this.setState({searchFieldValue: e.target.value});
        this.props.onChangeSearch(e.target.value);
    }
  }

  onChangeTypeField(newValue, actionMeta) {
    this.setState({ 
      typeValue: newValue
    });
    if (actionMeta.action === "select-option") {
        this.setState({
          typeFieldValue: newValue.value
        });
        this.props.onChangeTypeFilter(newValue.value);
      }
    if (actionMeta.action === "clear") {
      this.setState({
        typeFieldValue: '',
      });
      this.props.onChangeTypeFilter('');
    }  
  }

  onChangeOriginField(newValue, actionMeta) {
    this.setState({ 
      originValue: newValue
    });
    if (actionMeta.action === "select-option") {
        this.setState({
          originFieldValue: newValue.label
        });
        this.props.onChangeOriginFilter(newValue.label);
      }
    if (actionMeta.action === "clear") {
      this.setState({
        originFieldValue: '',
      });
      this.props.onChangeOriginFilter('');
    } 
  }

  toggleMoreOptions() {
    this.setState({
      showMoreOptions: !this.state.showMoreOptions
    });
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
      searchString: this.state.searchFieldValue,
      recipeType: this.state.typeFieldValue,
      origin: this.state.originFieldValue,
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
      this.props.onReturnSearchResults(json);
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
        tags: [],
        ingredients: [],
        searchFieldValue: '',
        typeFieldValue: '',
        originFieldValue: '',
        originValue: '',
        typeValue: '',        
      }
    );
    this.refs.searchInput.value = '';
    this.props.onClearSearch();
  }

  render () {
    return (

      <div className="filters row">

        <input type="text" className="form-control search-recipe-text-input" placeholder="Suchen" ref="searchInput" onChange={this.onChangeSearchField} />

        <div className="more-search-options row">
          <div className="col">
            <Select
              isClearable
              label="Single select"
              options={dishOptions}
              onChange={this.onChangeTypeField}
              className="search-recipe-input"
              value={this.state.typeValue}
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
              onChange={this.onChangeOriginField}
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
        </div>

        <div className="row more-search-options">
          <a className="col more-options-link" onClick={this.toggleMoreOptions}> Erweiterte Suche <span className="oi oi-chevron-bottom"></span></a>
        </div>

        <div className={this.state.showMoreOptions ? 'expand-search row more-search-options' : 'expand-search row more-search-options invisible'}>
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


          <div className="search-recipe-buttons">
            <button className="btn btn-success btn-search-recipe" type="submit" onClick={this.onSearchRecipe}>
              <span className="oi oi-magnifying-glass"></span>
            </button>
            <button className="btn btn-success btn-clear-recipe" onClick={this.onClearSearch}>
              <span className="oi oi-reload"></span>
            </button>
          </div>
        </div>
      </div>
    )
  }
}