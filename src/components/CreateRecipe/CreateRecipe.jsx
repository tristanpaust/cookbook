import React, { Component } from 'react';
import '../../css/App.css';
import '../../css/CreateRecipe.css';

import AddStep from './AddStep.jsx';
import AddTag from './AddTag.jsx';
import SearchTag from './SearchTag.jsx';
import AddIngredient from './AddIngredient.jsx';
import SearchIngredient from './SearchIngredient.jsx';
import ImageDropzone from './ImageDropzone.jsx';

import {Dropdown} from 'react-bootstrap';

export default class CreateRecipe extends Component {
  constructor() {
    super();
    this.state = {
      message: 'Loading...',
      tags: [],
      ingredients: [],
      dropDownValue: 'Select unit',
      steps: [{text: 'Get pot', key: 1}, {text: 'Turn on oven', key: 2} , {text: 'Fill water in pot', key: 3} , {text: 'Boil water', key: 4}]
    }
    this.onIngredientAdd = this.onIngredientAdd.bind(this);
    this.onDropdownClick = this.onDropdownClick.bind(this);
    this.onStepAdd = this.onStepAdd.bind(this);
    this.handleTagSelect = this.handleTagSelect.bind(this);
    this.handleIngredientSelect = this.handleIngredientSelect.bind(this);
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
  
  render() {
    return (
      <div className="container">
        <h1>Create a new Recipe</h1>

          <div className="container-fluid">

              <div className="row d-md-block">
                <div className="form-group">
                  <label>Title</label>
                  <input id="recipeTitle" className="form-control" name="recipeTitle" type="text"/>
                  <small className="form-text text-muted">Add something expressive to make sure everone will be able to find it later on.</small>
                </div>
              </div>

            <hr />

            <div className="">
              <div className="row">

                <div className="form-group col">
                  <label htmlFor="tags">Tags</label>
                    <div className="input-group">
                      <SearchTag onSelectTag={this.handleTagSelect}/>
                    </div>
                  <small className="form-text text-muted">The word will try to auto-complete as you type.</small>
                </div>

                <div className="form-group col">
                  <label htmlFor="ingredients">Ingredients</label>
                  <div className="input-group">
                    <SearchIngredient onSelectIngredient={this.handleIngredientSelect}/>
                    <small className="form-text text-muted">The word will try to auto-complete as you type.</small>
                    <AddIngredient onRef={ref => (this.child = ref)} entries={this.state.ingredients}/>
                  </div>
                </div>
                <button onClick={this.getIngredients}>Child.method()</button>
              </div>
            </div>
              
            <hr />

              <div className="row">
                <div className="">

                  <div className="col-md-auto float-left">
                    <div className="dropzone-wrapper">
                      <ImageDropzone/>
                    </div>
                  </div>  

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
      </div>
    );
  }
}