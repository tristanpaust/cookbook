import React, { Component } from 'react';
import '../../global.jsx'
import '../../css/Profile.css';

import validator from 'validator';
import FormValidator from '../FormValidator.jsx';

export default class Profile extends Component {
  constructor() {
    super();

    this.usernameValidator = new FormValidator([
      {
        field: 'newUsername', 
        method: validator.isEmpty, 
        validWhen: false, 
        message: 'Der neue Name darf nicht leer sein.' 
      } 
    ]);

    this.emailValidator = new FormValidator([
      {
        field: 'newEmail', 
        method: validator.isEmpty, 
        validWhen: false, 
        message: 'Die neue Email-Addresse darf nicht leer sein.' 
      },
      {
        field: 'newEmail', 
        method: validator.isEmail, 
        validWhen: true, 
        message: 'Die neue Email-Addresse muss gültig sein.' 
      },
    ]);

    this.passwordValidator = new FormValidator([
      {
        field: 'oldPassword', 
        method: validator.isEmpty, 
        validWhen: false, 
        message: 'Das alte Passwort darf nicht leer sein.' 
      },
      {
        field: 'newPassword', 
        method: validator.isEmpty, 
        validWhen: false, 
        message: 'Das neue Passwort darf nicht leer sein.' 
      },
      {
        field: 'newPasswordRepeat', 
        method: validator.isEmpty, 
        validWhen: false, 
        message: 'Die Wiederhohlung des neuen Passworts darf nicht leer sein.' 
      } 
    ]);


    this.state = {
      isLoading: true,
      isFetchingData: true,      
      message: 'Loading...',
      profile: {},
      
      isPasswordOpen: false,
      isUsernameOpen: false,
      isEmailOpen: false,

      newUsername: '',
      newEmail: '',
      oldPassword:'',
      newPassword: '',
      newPasswordRepeat: '',

      passwordMatch: false,

      usernameValidation: this.usernameValidator.valid(),
      emailValidation: this.emailValidator.valid(),
      passwordValidation: this.passwordValidator.valid(),

      usernameSubmitted: false,
      emailSubmitted: false,
      passwordSubmitted : false

    }

    this.openChangePassword = this.openChangePassword.bind(this);
    this.openChangeUsername = this.openChangeUsername.bind(this);
    this.openChangeEmail = this.openChangeEmail.bind(this);

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleOldPasswordChange = this.handleOldPasswordChange.bind(this);
    this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
    this.handleNewPasswordRepeatChange = this.handleNewPasswordRepeatChange.bind(this);

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
      isEmailOpen: !this.state.isEmailOpen,
      isUsernameOpen: false,
      isPasswordOpen: false
    })
  }
  
  openChangeUsername() {
    this.setState({
      isUsernameOpen: !this.state.isUsernameOpen,
      isEmailOpen: false,
      isPasswordOpen: false
    })
  }

  openChangePassword() {
    this.setState({
      isPasswordOpen: !this.state.isPasswordOpen,
      isEmailOpen: false,
      isUsernameOpen: false
    })
  }


  handleUsernameChange(e) {
    this.setState({
      newUsername: e.target.value
    }) 
  }
  
  handleEmailChange(e) {
    this.setState({
      newEmail: e.target.value
    })
  }
  
  handleOldPasswordChange(e) {
    this.setState({
      oldPassword: e.target.value
    })
  }
  
  handleNewPasswordChange(e) {
    this.setState({
      newPassword: e.target.value
    })
  }
  
  handleNewPasswordRepeatChange(e) {
    this.setState({
      newPasswordRepeat: e.target.value
    }, () => {
        if (this.state.newPassword === this.state.newPasswordRepeat) {
          this.setState({
            passwordMatch: true
        })
      }
    })
  }

  async changeUsername(e) {
    e.preventDefault();
    const usernameValidation = this.usernameValidator.validate(this.state);
    this.setState({ 
      usernameValidation,
      usernameSubmitted: true
    });

    if (usernameValidation.isValid) {
      await (global.FetchWithHeaders('POST', 'api/changeusername', { newUsername: this.state.newUsername }));
      await this.setStateAsync({
        isUsernameOpen: false,
        newUsername: ''
      });
      this.componentDidMount();
    }
  }

  async changeEmail(e) {
    e.preventDefault();
    const emailValidation = this.emailValidator.validate(this.state);
    this.setState({ 
      emailValidation,
      emailSubmitted:true
    });

    if (emailValidation.isValid) {
      const json = await (global.FetchWithHeaders('POST', 'api/changemailaddress', { newMail: this.state.newEmail }))
      console.log(json)
      await this.setStateAsync({
        isEmailOpen: false,
        newEmail: ''
      });
      this.componentDidMount();
    }
  }

  async changePassword(e) {
    e.preventDefault();
    const passwordValidation = this.passwordValidator.validate(this.state);
    this.setState({ 
      passwordValidation,
      passwordSubmitted: true
    });

    if (passwordValidation.isValid) {
      const json = await (global.FetchWithHeaders('POST', 'api/changepassword', { newPassword: this.state.newPassword }))
      await this.setStateAsync({
        isPasswordOpen: false,
        oldPassword: '',
        newPassword: '',
        newPasswordRepeat: ''
      });
    }
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

    let usernameValidation = this.usernameSubmitted ?
        this.usernameValidator.validate(this.state) :
        this.state.usernameValidation

    let emailValidation = this.emailSubmitted ?
        this.emailValidator.validate(this.state) :
        this.state.emailValidation

    let passwordValidation = this.passwordSubmitted ?
        this.passwordValidator.validate(this.state) :
        this.state.passwordValidation

    return (
      <div className="container">
        <div className="container-fluid">
          
          <h1>Hallo {this.state.profile.email}</h1>

          <div className="row">
            <p className="col"> Aktueller Benutzername: {this.state.profile.username}</p>
            <p className="col profile-button" onClick={this.openChangeUsername}>Benutzername ändern</p>
          </div>

          <div className={this.state.isUsernameOpen ? 'col' : 'hidden'}>
            <div className={'row' + (usernameValidation.newUsername.isInvalid && 'has-error')}>
              <form className="change-username-form">
                <input className="form-control" type="text" placeholder="Neuer Benutzername" onChange={this.handleUsernameChange}/>
                <button className="btn btn-success btn-profile-change" onClick={this.changeUsername}>Benutzername aktualisieren</button>
              </form>
            </div>
            <span className="help-block">{usernameValidation.newUsername.message}</span>
          </div>

          <div className="row">
            <p className="col"> Aktuelle Email-Adresse: {this.state.profile.email}</p>
            <p className="col profile-button" onClick={this.openChangeEmail}>Email-Adresse ändern</p>
          </div>

          <div className={this.state.isEmailOpen ? 'col' : 'hidden'}>
            <div className={'row' + (emailValidation.newEmail.isInvalid && 'has-error')}>
              <form className="change-email-form">
                <input className="form-control" type="email" placeholder="Neue Email-Adresse"  onChange={this.handleEmailChange}/>
                <button className="btn btn-success btn-profile-change" onClick={this.changeEmail}>Email aktualisieren</button>
              </form>
            </div>
            <span className="help-block">{emailValidation.newEmail.message}</span>
          </div>

          <div className="row">
            <p className="col">a</p>
            <p className="col profile-button" onClick={this.openChangePassword}>Passwort ändern</p>
          </div>

          <div className={this.state.isPasswordOpen ? 'col' : 'hidden'}>
            <div className={'row' + (passwordValidation.newPassword.isInvalid && 'has-error')}>
              <form className="change-password-form">
                <input className="form-control" type="password" placeholder="Altes Passwort"  onChange={this.handleOldPasswordChange}/>
                <input className="form-control" type="password" placeholder="Neues Passwort"  onChange={this.handleNewPasswordChange}/>
                <input className="form-control" type="password" placeholder="Neues Passwort wiederholen" onChange={this.handleNewPasswordRepeatChange}/>
                <div className="row">
                  <span className={this.state.passwordMatch ? 'hidden' : 'help-block col'}>Die neuen Passwörter stimmen nicht überein.</span>
                </div>
                <button className="btn btn-success btn-profile-change" onClick={this.changePassword}>Passwort aktualisieren</button>
              </form>
            </div>
            <span className="help-block">{passwordValidation.oldPassword.message}</span>            
            <span className="help-block">{passwordValidation.newPassword.message}</span>
            <span className="help-block">{passwordValidation.newPasswordRepeat.message}</span>
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