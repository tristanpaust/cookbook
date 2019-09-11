import React, { Component } from 'react';
import '../../global.jsx'

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

  async componentDidMount() {
    const json = await (global.FetchWithHeaders('GET', 'api/getpopulatedcurrentuser'))
    await this.setStateAsync({ 
      isFetchingData: false,
      isLoading: false,
      profile: json 
    });

  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  createItems(item) {
    return (
      <li key={item._id}>
        {item.title}
      </li>
    )
  }

  render() {


    if (this.state.isLoading) {
      return <p>{this.state.message}</p>;
    }
    else {
      var listItems = this.state.profile.favorites.map(this.createItems);

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
    }  
    return (

      <div className="container">
        <div className="container-fluid">
          
          <h1>Hallo {this.state.profile.email}</h1>
          <a>Profil bearbeiten</a>

          <h1>Favoriten</h1>
          <div className="row">
            <ul>
              {listItems}
            </ul>
          </div>

          <h1>Meine Rezepte</h1>
          <div className="row">
            
          </div>

        </div>
      </div>

    );
  }
}