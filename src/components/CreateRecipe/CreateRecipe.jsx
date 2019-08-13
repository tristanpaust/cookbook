import React, { Component } from 'react';
import '../../css/App.css';
import '../../css/CreateRecipe.css';

import AddStep from './AddStep.jsx';
import SearchTag from './SearchTag.jsx';
import AddIngredient from './AddIngredient.jsx';
import SearchIngredient from './SearchIngredient.jsx';
import ImageDropzone from './ImageDropzone.jsx';

import {countryOptions} from './SelectOptions.jsx';
import {dishOptions} from './SelectOptions.jsx';

import Select from 'react-select';

export default class CreateRecipe extends Component {
  constructor() {
    super();
    this.state = {
      message: 'Loading...',
      isFocused: false,
      tags: [],
      ingredients: [],
      steps: [{text: 'Get pot', key: 1}, {text: 'Turn on oven', key: 2} , {text: 'Fill water in pot', key: 3} , {text: 'Boil water', key: 4}]
    }
    this.onIngredientAdd = this.onIngredientAdd.bind(this);
    this.onDropdownClick = this.onDropdownClick.bind(this);
    this.onStepAdd = this.onStepAdd.bind(this);
    this.handleTagSelect = this.handleTagSelect.bind(this);
    this.handleIngredientSelect = this.handleIngredientSelect.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  componentDidMount() {
    fetch('/api/recipelist')
      .then(res => res.text())
      .then(res => this.setState({message: res}));
  }

  onIngredientAdd(e) {
    let ingredient = this.refs.ingredient.value;
    let amount = this.refs.amount.value;
    
    var newIngredient = {
      text: amount + ' of ' + ingredient,
      key: Date.now()
    }

    this.setState((prevState) => {
      return { 
        ingredients: prevState.ingredients.concat(newIngredient) 
      };
    });
    this.refs.ingredient.value = '';
    this.refs.amount.value = '';
    e.preventDefault();
  }

  onDropdownClick(e) {
    this.setState({dropDownValue: e.currentTarget.textContent}) 
  }

  onStepAdd(e) {
    let step = this.refs.step.value;

    let newStep = {
      text: step,
      key: Date.now
    }

    this.setState((prevState) => {
      return {
        steps: prevState.steps.concat(newStep)
      };
    });
    this.refs.step.value = '';
    e.preventDefault();
  }

  handleTagSelect(options) {
    this.setState({tags: options});
  }

  handleIngredientSelect(options) {
    this.setState({ingredients: options});
    console.log(this.state.ingredients);
  }

  getIngredients = () => {
    var ingredientArray = this.child.getAllIngredients()
    console.log(ingredientArray);
  }

    onFocus() {
      this.setState({
        isFocused: true
      });
    }

    onBlur() {
      this.setState({
        isFocused: false
      });
    }

  render() {
    var classes = [];

    if(this.state.isFocused) {
      classes.push('input--focused');
    }

    return (
      <div className="container">
          <div className="container-fluid">

            <div className="row d-md-block">
                <span id="titleWrapper" className="input input--animated">
                  <input id="recipeTitle" className="input__field input__field--animated" name="recipeTitle" type="text"/>
                  <label className="input__label input__label--animated input__label--animated-color-1" htmlFor="recipeTitle">
                    <span className="input__label-content input__label-content--animated">Neues Rezept erstellen</span>
                  </label>                  
                </span>
            </div>

            <hr />

            <h1 className="recipe-headline" htmlFor="ingredients">Generelle Angaben</h1>

            <div id="generalInfo" className="row">

              <div className="col-md-auto float-left">
                <div className="dropzone-wrapper">
                  <ImageDropzone/>
                </div>
              </div> 

              <div className="input-group col">
                <div className="row">
                  <textarea id="description" className="general-info-input" name="textarea" placeholder="Kurzbeschreibung des Rezepts"></textarea>
                  <small className="form-text text-muted">Nach was schmeckt das Rezept? Ist es schnell zuzubereiten? Etc.</small>
                </div>

                <div className="row">
                  <Select
                    placeholder="-- Bitte Herkunfsland auswählen --"
                    label="Single select"
                    options={countryOptions}
                    className="general-info-input"
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        text: '#6a7989',
                        primary25: '#289fad',
                        primary: '#6a7989',
                      },
                    })}
                  />
                  <small className="form-text text-muted">Wo kommt das Rezept her?</small>
                </div>

                <div className="row">
                  <Select
                    placeholder="-- Bitte Rezeptart auswählen --"
                    label="Single select"
                    options={dishOptions}
                    className="general-info-input"
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        text: '#6a7989',
                        primary25: '#289fad',
                        primary: '#6a7989',
                      },
                    })}                  
                  />
                  <small className="form-text text-muted">Vorspeise, Hauptspeise, Nachspeise, usw.</small>
                </div>

                <div className="row">
                    <div className="input-group">
                      <SearchTag onSelectTag={this.handleTagSelect}/>
                    </div>
                  <small className="form-text text-muted">Erstelle oder suche 3 Begriffe, um das Rezept zu beschreiben (scharf, Eintopf, Braten, usw.)</small>
                </div>
              </div>
            </div>

            <hr />

            <div className="row">
              <div className="form-group col">

                <h1 className="recipe-headline" htmlFor="ingredients">Zutaten</h1>

                <div className="input-group">
                  <SearchIngredient onSelectIngredient={this.handleIngredientSelect}/>
                  <small className="form-text text-muted">Suche oder erstelle Zutaten, um sie dem Rezept hinzuzufügen.</small>
                  <AddIngredient entries={this.state.ingredients}/>
                </div>
              </div>
            </div>
              
            <hr />

              <div className="row">
                  <div className="col-md-auto float-left">
                    <div>
                      <p> Add a new step </p>
                      <input id="step" name="step" type="text" ref="step"/>
                      <button className="btn btn-success" onClick={this.onStepAdd}>Add</button>
                      <AddStep entries={this.state.steps}/>
                    </div>
                  </div>
              </div>

          </div>
      </div>
    );
  }
}