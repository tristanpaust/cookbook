import React, { Component } from 'react';
import '../../css/App.css';

export default class CreateTag extends Component {
  constructor() {
    super();
    this.state = {
      title : '',
    };
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }

  onSubmit = (event) => {
    event.preventDefault();
    fetch('/api/savetag', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status === 200) {
        this.props.history.push('/');
      } else {
        const error = new Error(res.error);
        throw error;
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error saving new tag. Please try again');
    });
  }


  render() {
    return (
      <div className="container">
        <h1>Create a new Tag</h1>
                  
          <div className="container-fluid">

            <form onSubmit={this.onSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Enter new Tag"
                value={this.state.title}
                onChange={this.handleInputChange}
                required
              />
              <input type="submit" value="Submit"/>
            </form>

          </div>
      </div>
    );
  }
}