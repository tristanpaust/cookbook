import React, { Component } from 'react';
import { Link, Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "open-iconic/font/css/open-iconic-bootstrap.css"
import logo from './logo.svg';

import withAuth from './withAuth';
import Home from './Home';

import Login from './components/Login';
import Register from './components/Register';

import RecipeList from "./components/RecipeList/RecipeList";
import CreateRecipe from "./components/CreateRecipe/CreateRecipe";
import ViewRecipe from "./components/ViewRecipe";
import EditRecipe from "./components/EditRecipe";

import IngredientList from "./components/IngredientList";

import CreateTag from "./components/Tags/CreateTag";


class App extends Component {
  render() {
    return (
      <Router>
        <div className="full-width container">
            <nav className="navbar navbar-expand-lg">
              <a className="navbar-brand" href="https://codingthesmartway.com" target="_blank" rel="noopener noreferrer">
                <img src={logo} width="30" height="30" alt="CodingTheSmartWay.com" />
              </a>
              <Link to="/" className="navbar-brand">Kochbuch</Link>
              <div className="collpase navbar-collapse">
                <ul className="navbar-nav mr-auto">
                  <li className="navbar-item">
                    <Link to="/" className="nav-link">Home</Link>
                  </li>
                  <li className="navbar-item">
                    <Link to="/recipes" className="nav-link">Recipes</Link>
                  </li>
                  <li className="navbar-item">
                    <Link to="/ingredients" className="nav-link">Ingredients</Link>
                  </li>
                  </ul>
              </div>
              
              <div className="collpase navbar-collapse justify-content-end small">
                <ul className="navbar-nav">
                  <li className="navbar-item">
                    <Link to="/login" className="nav-link">Login</Link>
                  </li>
                  <li className="navbar-item">
                    <Link to="/register" className="nav-link">Register</Link>
                  </li>
                </ul>
              </div>
            </nav>
            <br/>
        
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/recipes" component={withAuth(RecipeList)} />
            <Route path="/recipe/create" component={withAuth(CreateRecipe)} />
            <Route path="/recipe/view/:id" component={withAuth(ViewRecipe)} />
            <Route path="/recipe/edit/:id" component={withAuth(EditRecipe)} />

            <Route path="/ingredients" component={withAuth(IngredientList)} />
            <Route path="/tag/create" component={withAuth(CreateTag)} />

            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
