import React, { Component } from 'react';
import '../../css/App.css';
import '../../css/CreateRecipe.css';

import AddStep from './AddStep.jsx';
import SearchTag from './SearchTag.jsx';
import AddIngredient from './AddIngredient.jsx';
import SearchIngredient from './SearchIngredient.jsx';
import ImageDropzone from './ImageDropzone.jsx';
import FormValidator from '../FormValidator.jsx';

import {countryOptions} from './SelectOptions.jsx';
import {dishOptions} from './SelectOptions.jsx';

import Select from 'react-select';

export default class CreateRecipe extends Component {
  constructor() {
    super();

    this.validator = new FormValidator([
      { 
        field: 'title', 
        method: this.isNotUndefined, 
        validWhen: true, 
        message: 'Das Rezept muss eine Überschrift haben.' 
      },
      { 
        field: 'description', 
        method: this.isNotUndefined, 
        validWhen: true, 
        message: 'Das Rezept muss eine kurze Beschreibung haben.' 
      },      
      { 
        field: 'servings', 
        method: this.isNotZero, 
        validWhen: true, 
        message: 'Personenanzahl kann nicht 0 sein.' 
      },
      { 
        field: 'origin', 
        method: this.isNotUndefined, 
        validWhen: true, 
        message: 'Ein Herkunfsland muss ausgewählt werden.' 
      },
      { 
        field: 'type', 
        method: this.isNotUndefined, 
        validWhen: true, 
        message: 'Eine Rezeptart muss ausgewählt werden.' 
      },              
      { 
        field: 'tags', 
        method: this.arrayNotEmpty, 
        validWhen: true, 
        message: 'Tags are required.' 
      },
      { 
        field: 'tags',
        method: this.arrayBiggerThan, 
        validWhen: true, 
        message: 'At least 3 tags are needed'
      },
      { 
        field: 'ingredients', 
        method: this.arrayNotEmpty, 
        validWhen: true, 
        message: 'Ingredients are required'
      },
      { 
        field: 'steps', 
        method: this.arrayNotEmpty, 
        validWhen: true, 
        message: 'Steps are required.'
      }
    ]);

    this.state = {
      message: 'Loading...',
      title: undefined,
      imageName: '',
      servings: 0,
      origin: undefined,
      type: undefined,
      tags: [],
      ingredients: [],
      steps: [],
      validation: this.validator.valid(),
    }
    
    this.submitted = false;

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleServingsChange = this.handleServingsChange.bind(this);
    this.handleOriginChange = this.handleOriginChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleTagSelect = this.handleTagSelect.bind(this);
    this.handleIngredientSelect = this.handleIngredientSelect.bind(this);
    this.handleIngredientDelete = this.handleIngredientDelete.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);

    this.onStepAdd = this.onStepAdd.bind(this);
    this.handleStepDelete = this.handleStepDelete.bind(this);

    this.increasePeople = this.increasePeople.bind(this);
    this.decreasePeople = this.decreasePeople.bind(this);

    this.child = React.createRef();
  }

  componentDidMount() {
    fetch('/api/recipelist')
      .then(res => res.text())
      .then(res => this.setState({message: res}));
  }

  //Event handlers
  handleTitleChange(e) {
    this.setState({title: e.target.value});
  }

  handleImageChange(imgName) {
    this.setState({imageName: imgName});
  }

  handleDescriptionChange(e) {
    this.setState({description: e.target.value});
  }

  handleServingsChange(e) {
    this.setState({servings: e.target.value})
  }

  handleOriginChange(option) {
    this.setState({origin: option.label});
  }

  handleTypeChange(option) {
    this.setState({type: option.value});
  }

  handleTagSelect(options) {
    this.setState({tags: options});
  }

  handleIngredientSelect(options) {console.log(options);
    this.setState({ingredients: options});
  }

  handleIngredientDelete(id) {
    var array = [...this.state.ingredients]; // make a separate copy of the array

    for (let i = 0; i < array.length; i++) {
      if (array[i]['item'].value === id) {
        array.splice(i, 1);
        this.setState({ingredients: array});
        this.child.current.deleteIngredient(id);
      }
    }
  }

  handleStepDelete(id) {
    var array = [...this.state.steps];

    for (let i = 0; i < array.length; i++) {
      if (array[i]['key'] === id) {
        array.splice(i, 1);
        return this.setState({steps: array});
      }
    }
  }

  getIngredients = () => {
    var ingredientArray = this.child.getAllIngredients()
  }

  handleFormSubmit = event => {
    event.preventDefault();
    const validation = this.validator.validate(this.state);
    this.setState({ validation });
    this.submitted = true;

    if (validation.isValid) {
      console.log('form is valid and can be submitted.');
    }
    else {
      console.log('form is not valid.');
    }
  }

  // Helper functions
  onStepAdd(e) {
    let step = this.refs.step.value;

    let newStep = {
      text: step,
      key: 'step' + parseInt(this.state.steps.length+1)
    }

    this.setState((prevState) => {
      return {
        steps: prevState.steps.concat(newStep)
      };
    });
    this.refs.step.value = '';
    e.preventDefault();
  }

  increasePeople() {
    this.setState({servings: parseInt(this.state.servings) + 1});
  }
  
  decreasePeople() {
    if (parseInt(this.state.servings) >= 1) {
      this.setState({servings: parseInt(this.state.servings) - 1});
    }
  }

  isNotZero = (num) => (num > 0)

  arrayNotEmpty = (array) => (array.length > 0)

  arrayBiggerThan = (array) => (array.length >= 3)

  isNotUndefined = (str) => (str !== undefined)

  render() {
   let validation = this.submitted ?
                    this.validator.validate(this.state) :
                    this.state.validation

    return (
      <form className="create-recipe-form">
        <div className="container">
            <div className="container-fluid container-create-recipe">

              <div className={'row d-md-block' + (validation.title.isInvalid && 'has-error')}>
                  <span id="titleWrapper" className="input input--animated">
                    <input id="recipeTitle" className="input__field input__field--animated" name="recipeTitle" type="text" onChange={this.handleTitleChange}/>
                    <label className="input__label input__label--animated input__label--animated-color-1" htmlFor="recipeTitle">
                      <span className="input__label-content input__label-content--animated">Neues Rezept erstellen</span>
                    </label>                  
                  </span>
                  <span className="help-block">{validation.title.message}</span>
              </div>

              <hr />

              <h1 className="recipe-headline" htmlFor="ingredients">Generelle Angaben</h1>

              <div id="generalInfo" className="row">

                <div className="col-md-auto float-left">
                  <div className="dropzone-wrapper">
                    <ImageDropzone onImageChange={this.handleImageChange}/>
                  </div>
                </div> 

                <div className="input-group col">
                  <div className={'row ' + (validation.description.isInvalid && 'has-error')}>
                    <textarea id="description" className="general-info-input" name="textarea" placeholder="Kurzbeschreibung des Rezepts" onChange={this.handleDescriptionChange}></textarea>
                    <small className="form-text text-muted">Nach was schmeckt das Rezept? Ist es schnell zuzubereiten? Etc.</small>
                    <span className="help-block">{validation.description.message}</span>
                  </div>

                  <div className={'row ' + (validation.servings.isInvalid && 'has-error')}>
                    <div className="wrapper">
                        <div className="value-button btn-danger" id="decrease" onClick={this.decreasePeople}>-</div>
                        <input type="text" pattern="[0-9]*" className="form-control" id="people" value={this.state.servings} onChange={this.handleServingsChange}/>
                        <div className="value-button btn-success" id="increase" onClick={this.increasePeople}>+</div>
                      </div>
                      <small className="form-text text-muted">Für wie viele Personen ist das Rezept?</small>
                      <span className="help-block">{validation.servings.message}</span>
                  </div>

                  <div className={'row ' + (validation.origin.isInvalid && 'has-error')}>
                    <Select
                      placeholder="-- Bitte Herkunfsland auswählen --"
                      label="Single select"
                      onChange={this.handleOriginChange}
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
                    <span className="help-block">{validation.origin.message}</span>                  
                  </div>

                  <div className={'row ' + (validation.type.isInvalid && 'has-error')}>
                    <Select
                      placeholder="-- Bitte Rezeptart auswählen --"
                      label="Single select"
                      options={dishOptions}
                      onChange={this.handleTypeChange}
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
                    <span className="help-block">{validation.type.message}</span>                  
                  </div>

                  <div className="row">
                      <div className={'input-group ' + (validation.tags.isInvalid && 'has-error')}>
                        <SearchTag onSelectTag={this.handleTagSelect}/>
                      </div>
                    <small className="form-text text-muted">Erstelle oder suche 3 Begriffe, um das Rezept zu beschreiben (scharf, Eintopf, Braten, usw.)</small>
                    <span className="help-block">{validation.tags.message}</span>
                  </div>
                </div>
              </div>

              <hr />

              <div className="row" id="ingredients">
                <div className="form-group col">

                  <h1 className="recipe-headline" htmlFor="ingredients">Zutaten</h1>

                  <div className={'input-group ' + (validation.ingredients.isInvalid && 'has-error')}>
                    <SearchIngredient onSelectIngredient={this.handleIngredientSelect} ref={this.child}   />
                    <small className="form-text text-muted">Suche oder erstelle Zutaten, um sie dem Rezept hinzuzufügen.</small>
                     <span className="help-block">{validation.ingredients.message}</span>
                    <AddIngredient entries={this.state.ingredients} onHandleDelete={this.handleIngredientDelete}/>
                  </div>
                </div>
              </div>
                
              <hr />

                <div className="row">
                  <div className="form-group col">
                    <h1 className="recipe-headline" htmlFor="ingredients">Zubereitung</h1>
                      
                      <div className="input-group">
                        <input 
                          id="step" 
                          name="step" 
                          type="text" 
                          ref="step"
                          className={'col form-control step-control ' + (validation.steps.isInvalid && 'has-error')}
                          onKeyPress={event => {
                            if (event.key === 'Enter') {
                              this.onStepAdd(event)
                            }
                          }}
                        />
                        <small className="form-text text-muted">Suche oder erstelle Zutaten, um sie dem Rezept hinzuzufügen.</small>
                        <span className="help-block">{validation.steps.message}</span>
                      </div>
                      <AddStep entries={this.state.steps} onHandleDelete={this.handleStepDelete}/>
                    </div>
                </div>

              <button onClick={this.handleFormSubmit} className="btn btn-primary pull-right btn btn-create-recipe">Rezept erstellen</button> 

          </div>
        </div>
      </form>
    );
  }
}