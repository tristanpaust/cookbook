import React, { Component } from 'react';

export default class EditRecipe extends Component {
  constructor() {
    super();

    this.state = {
      message: 'Loading...',
    }
  }

  componentDidMount() {
    fetch('/api/recipelist')
      .then(res => res.text())
      .then(res => this.setState({message: res}));
  }

  render() {

    return (
      <p>Hello again</p>
    );
  }
}