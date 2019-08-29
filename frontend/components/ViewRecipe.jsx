import React, { Component } from 'react';

export default class ViewRecipe extends Component {
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
    console.log(this.props);
    console.log(this.props.match.params.id);
    return (
      <p>Hello</p>
    );
  }
}