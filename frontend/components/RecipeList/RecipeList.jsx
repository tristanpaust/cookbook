import React, { Component } from 'react';
import '../../css/RecipeList.css';

import RecipeGrid from './RecipeGrid.jsx';
import SearchBar from './SearchBar.jsx';

export default class RecipeList extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      isFetchingData: true,
      message: 'Loading...',
      recipes: null,

      searchString: '',
      typeFilter: '',
      originFilter: ''
    }

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleTypeFilterChange = this.handleTypeFilterChange.bind(this);
    this.handleOriginFilterChange = this.handleOriginFilterChange.bind(this);
    this.handleNewRecipeQueue = this.handleNewRecipeQueue.bind(this);
    this.handleClearSearch = this.handleClearSearch.bind(this);
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

  handleSearchChange(searchString) {
    this.setState({searchString: searchString});
  }

  handleTypeFilterChange(filter) {
    this.setState({typeFilter: filter});
  }

  handleOriginFilterChange(filter) {
    this.setState({originFilter: filter});
  }

  handleNewRecipeQueue(results) {
    this.setState({recipes: results});
  }

  handleClearSearch() {
    this.setState({
      searchString: '',
      typeFilter: '',
      originFilter: ''
    });
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
          
            <SearchBar onReturnSearchResults={this.handleNewRecipeQueue} onClearSearch={this.handleClearSearch} onChangeSearch={this.handleSearchChange} onChangeTypeFilter={this.handleTypeFilterChange} onChangeOriginFilter={this.handleOriginFilterChange}/>

            <hr/>

            <div className="d-flex justify-content-center hidden" id="spinner">
              <div className="spinner-border" role="status">
                <span className="sr-only">Laden...</span>
              </div>
            </div>

            
            <RecipeGrid entries={this.state.recipes} searchString={this.state.searchString} typeFilter={this.state.typeFilter} originFilter={this.state.originFilter}/>

          </div>
        </div>
      );
    }
  }
}