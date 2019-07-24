import React, { Component } from 'react';

export default class RecipeList extends Component {
  constructor() {
    super();
    this.state = {
      message: 'Loading...'
    }
  }

  componentDidMount() {
    fetch('/api/recipelist')
      .then(res => res.text())
      .then(res => this.setState({message: res}));
  }

  render() {
    return (
      <div class="container">
        <h1>All Recipes</h1>
        <p>{this.state.message}</p>
      </div>
    );
  }
}