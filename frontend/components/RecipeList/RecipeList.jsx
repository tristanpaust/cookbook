import React, { Component } from 'react';
import '../../css/RecipeList.css';
import '../../global.jsx'

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

      searchQueue: [],

      currentPage: 1,
      recipesPerPage: 4,
      pageNumbers: [], 
      recipesOnPage: [],

      firstItem: 0,
      lastItem: 4
    }

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleTypeFilterChange = this.handleTypeFilterChange.bind(this);
    this.handleOriginFilterChange = this.handleOriginFilterChange.bind(this);
    this.handleNewRecipeQueue = this.handleNewRecipeQueue.bind(this);
    this.handleClearSearch = this.handleClearSearch.bind(this);

    this.renderPageNumbers = this.renderPageNumbers.bind(this);
    this.changePage = this.changePage.bind(this);   
    this.goPageBackward = this.goPageBackward.bind(this);
    this.goPageForward = this.goPageForward.bind(this); 
  }

  componentDidMount() {
    global.FetchWithHeaders('GET', 'api/recipelist')
      .then(res => 
        this.setState({
          isFetchingData: false,
          recipes: res,
          recipesOnPage: res,
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
    this.setState({searchQueue: results});
  }

  handleClearSearch() {
    this.setState({
      searchString: '',
      typeFilter: '',
      originFilter: '',
      searchQueue: [],
      firstItem: 0,
      lastItem: this.state.recipesPerPage
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

  goPageBackward() {
    if (this.state.currentPage !== 1) {
      let page = Number(this.state.currentPage - 1);
      this.setState({
        currentPage: page
      })
      const indexOfLastRecipe = page * this.state.recipesPerPage;
      const indexOfFirstRecipe = indexOfLastRecipe - this.state.recipesPerPage;

      this.setState({
        firstItem: indexOfFirstRecipe,
        lastItem: indexOfLastRecipe
      });
    }
  }

  goPageForward() {
    if ((this.state.currentPage) <= (this.state.recipes.length / this.state.recipesPerPage)) {
      let page = Number(this.state.currentPage + 1);
      this.setState({
        currentPage: page
      })
      const indexOfLastRecipe = page * this.state.recipesPerPage;
      const indexOfFirstRecipe = indexOfLastRecipe - this.state.recipesPerPage;

      this.setState({
        firstItem: indexOfFirstRecipe,
        lastItem: indexOfLastRecipe
      });
    } 
  }

  renderPageNumbers(number) {
    let classes = "page-number-item"
    if (number === this.state.currentPage) {
      classes = "page-number-item active"
    }
    return (
      <span className={classes}
        key={number}
        id={number}
        onClick={this.changePage}
      >
        {number}
      </span>
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

            
            <RecipeGrid entries={this.state.recipes} searchResults={this.state.searchQueue} firstItem={this.state.firstItem} lastItem={this.state.lastItem} searchString={this.state.searchString} typeFilter={this.state.typeFilter} originFilter={this.state.originFilter}/>

            <div className={"row " + (this.state.searchQueue.length ? 'hidden' : 'shown')}>
              <div className="page-numbers col text-center">
                <span><span className="oi oi-chevron-left page-before" onClick={this.goPageBackward}></span></span>
                {pages}
                <span><span className="oi oi-chevron-right page-after" onClick={this.goPageForward}></span></span>
              </div>
            </div>

          </div>
        </div>
      );
    }
  }
}