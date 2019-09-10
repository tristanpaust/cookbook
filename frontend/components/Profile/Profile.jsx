import React, { Component } from 'react';

export default class Profile extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: true,
      isFetchingData: true,      
      message: 'Loading...',
      profile: {},
    }

  }

  componentDidMount() {
    fetch('/api/getcurrentuser')
  }

  render() {
    return (
      <div className="container">
        <div className="container-fluid">
          Hello
        </div>
      </div>

    );
  }
}