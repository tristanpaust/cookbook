import React, { Component } from 'react';

export default class RecipeList extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      message: 'Loading...',
      recipes: null
    }
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

  createItems(element) {console.log(element.title)
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
          <h1>All Recipes</h1>
        
          <ul className="recipe-list">
          {
            this.state.recipes.map(function(recipe){
              return <li key={recipe._id}> {recipe.title} </li>;
            })
          }
          </ul>
        </div>
      );
    }
  }
}