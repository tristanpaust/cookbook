import React, { Component } from 'react';
import '../../global.jsx'
import '../../css/Profile.css';

export default class Profile extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: true,
      isFetchingData: true,      
      message: 'Loading...',
      profile: {},
      isPasswordOpen: false,
      isUsernameOpen: false,
      isEmailOpen: false
    }

    this.openChangePassword = this.openChangePassword.bind(this);
    this.openChangeUsername = this.openChangeUsername.bind(this);
    this.openChangeEmail = this.openChangeEmail.bind(this);

    this.changePassword = this.changePassword.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
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

  openChangeEmail() {
    this.setState({
      isEmailOpen: !this.state.isEmailOpen
    })
  }
  
  openChangeUsername() {
    this.setState({
      isUsernameOpen: !this.state.isUsernameOpen
    })
  }

  openChangePassword() {
    this.setState({
      isPasswordOpen: !this.state.isPasswordOpen
    })
  }

  changeEmail() {

  }

  changeUsername() {

  }

  changePassword() {

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
      var favorites = this.state.profile.favorites.map(this.createItems);
      var authored = this.state.profile.author.map(this.createItems);

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

          <div className="row">
            <p className="col"> Aktueller Benutzername: {this.state.profile.username}</p>
            <p className="col profile-button" onClick={this.openChangeUsername}>Benutzername ändern</p>
          </div>

          <div className={this.state.isUsernameOpen ? 'row' : 'hidden'}>
            <input type="text" placeholder="Neuer Benutzername" />
            <button onClick={this.changeUsername}>Benutzername aktualisieren</button>
          </div>

          <div className="row">
            <p className="col"> Aktuelle Email-Adresse: {this.state.profile.email}</p>
            <p className="col profile-button" onClick={this.openChangeEmail}>Email-Adresse ändern</p>
          </div>

          <div className={this.state.isEmailOpen ? 'row' : 'hidden'}>
            <input type="mail" placeholder="Neue Email-Adresse" />
            <button onClick={this.changeEmail}>Email aktualisieren</button>
          </div>

          <div className="row">
            <p className="col">a</p>
            <p className="col profile-button" onClick={this.openChangePassword}>Passwort ändern</p>
          </div>

          <div className={this.state.isPasswordOpen ? 'row' : 'hidden'}>
            <input type="password" placeholder="Altes Passwort" />
            <input type="password" placeholder="Neues Passwort" />
            <input type="password" placeholder="Neues Passwort wiederholen" />

            <button onClick={this.changePassword}>Passwort aktualisieren</button>
          </div>

          <h1>Favoriten</h1>
          <div className="row">
            <ul>
              {favorites}
            </ul>
          </div>

          <h1>Meine Rezepte</h1>
          <div className="row">
            <ul>
              {authored}
            </ul>
          </div>

        </div>
      </div>

    );
  }
}