import React, { Component } from 'react';

export default class IngredientList extends Component {
  constructor() {
    super();
    this.state = {
      message: 'Loading...'
    }
  }

  componentDidMount() {
    fetch('/api/ingredientlist')
      .then(res => res.text())
      .then(res => this.setState({message: res}));
  }

  render() {
    return (
      <div class="container">
        <h1>All Ingredients</h1>
        <p>{this.state.message}</p>
      </div>
    );
  }
}