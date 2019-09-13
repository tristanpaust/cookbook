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

  async changeEmail() {
    const json = await (global.FetchWithHeaders('POST', 'api/changemailaddress', { newMail: this.refs.newMail.value }))
    await this.setStateAsync({
      isEmailOpen: false
    });
    this.refs.newEmail.value = '';
    this.componentDidMount();
  }

  async changeUsername() {
    const json = await (global.FetchWithHeaders('POST', 'api/changeusername', { newUsername: this.refs.newUsername.value }));
    await this.setStateAsync({
      isUsernameOpen: false
    });
    this.refs.newUsername.value = '';
    this.componentDidMount();
  }

  async changePassword() {
    const json = await (global.FetchWithHeaders('POST', 'api/changepassword', { newPassword: this.refs.newPassword.value }))
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

          <div className={this.state.isUsernameOpen ? 'col' : 'hidden'}>
            <input className="form-control" type="text" placeholder="Neuer Benutzername" ref="newUsername"/>
            <button className="btn btn-success" onClick={this.changeUsername}>Benutzername aktualisieren</button>
          </div>

          <div className="row">
            <p className="col"> Aktuelle Email-Adresse: {this.state.profile.email}</p>
            <p className="col profile-button" onClick={this.openChangeEmail}>Email-Adresse ändern</p>
          </div>

          <div className={this.state.isEmailOpen ? 'col' : 'hidden'}>
            <input className="form-control" type="email" placeholder="Neue Email-Adresse" ref="newMail"/>
            <button className="btn btn-success" onClick={this.changeEmail}>Email aktualisieren</button>
          </div>

          <div className="row">
            <p className="col">a</p>
            <p className="col profile-button" onClick={this.openChangePassword}>Passwort ändern</p>
          </div>

          <div className={this.state.isPasswordOpen ? 'col' : 'hidden'}>
            <input className="form-control" type="password" placeholder="Altes Passwort" />
            <input className="form-control" type="password" placeholder="Neues Passwort" ref="newPassword"/>
            <input className="form-control" type="password" placeholder="Neues Passwort wiederholen" />

            <button className="btn btn-success" onClick={this.changePassword}>Passwort aktualisieren</button>
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