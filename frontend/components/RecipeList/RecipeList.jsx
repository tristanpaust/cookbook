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
      originFilter: '',

      currentPage: 1,
      recipesPerPage: 3,
      pageNumbers: [], 
      recipesOnPage: [],

      firstItem: 0,
      lastItem: 3
    }

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleTypeFilterChange = this.handleTypeFilterChange.bind(this);
    this.handleOriginFilterChange = this.handleOriginFilterChange.bind(this);
    this.handleNewRecipeQueue = this.handleNewRecipeQueue.bind(this);
    this.handleClearSearch = this.handleClearSearch.bind(this);


    this.renderPageNumbers = this.renderPageNumbers.bind(this);
    this.changePage = this.changePage.bind(this);    
  }

  componentDidMount() {
    fetch('/api/recipelist')
      .then(res => res.text())
      .then(res => 
        this.setState({
          isFetchingData: false,
          recipes: JSON.parse(res),
          recipesOnPage: JSON.parse(res),
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

  renderPageNumbers() {
    const indexOfLastRecipe = this.state.currentPage * this.state.recipesPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - this.state.recipesPerPage;
    const currentRecipes = this.state.recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);       

    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(this.state.recipes.length / this.state.recipesPerPage); i++) {
      pageNumbers.push(i);
    }
    pageNumbers.map(number => {
      return (
        <li
          key={number}
          id={number}
          onClick={this.changePage}
        >
          {number}
        </li>
      );
    });       
  }

  changePage(event) {
    let page = Number(event.target.id);
    this.setState({
      currentPage: page,
    });

    const indexOfLastRecipe = page * this.state.recipesPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - this.state.recipesPerPage;

    this.setState({
      firstItem: indexOfFirstRecipe,
      lastItem: indexOfLastRecipe
    });
  }

  renderPageNumbers(number) {
    return (
      <li className="xcxcx"
        key={number}
        id={number}
        onClick={this.changePage}
      >
        {number}
      </li>
    );   
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

        const indexOfLastRecipe = this.state.currentPage * this.state.recipesPerPage;
        const indexOfFirstRecipe = indexOfLastRecipe - this.state.recipesPerPage;
        const currentRecipes = this.state.recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);       
        const pageNumbers = [];

        for (let i = 1; i <= Math.ceil(this.state.recipes.length / this.state.recipesPerPage); i++) {
          pageNumbers.push(i);
        }

        var pages = pageNumbers.map(this.renderPageNumbers);
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

            
            <RecipeGrid entries={this.state.recipes} firstItem={this.state.firstItem} lastItem={this.state.lastItem} searchString={this.state.searchString} typeFilter={this.state.typeFilter} originFilter={this.state.originFilter}/>

            <ul id="page-numbers">
              {pages}
            </ul>

          </div>
        </div>
      );
    }
  }
}