import React, { Component } from 'react';
import '../../css/App.css';
import '../../css/CreateRecipe.css';

import AddStep from './AddStep.jsx';
import AddTag from './AddTag.jsx';
import SearchTag from './SearchTag.jsx';
import AddIngredient from './AddIngredient.jsx';
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

            <div className="row d-md-flex">
              <div className="">
                <div>
                  <p>Please add at least 3 tags to complete this recipe. </p>
                </div>
                <div className="form-group">
                  <label htmlFor="tags">Tags</label>
                    <div className="input-group">
                      <SearchTag onSelectTag={this.handleTagSelect}/>
                    </div>
                  <small className="form-text text-muted">The word will try to auto-complete as you type.</small>
                </div>
              </div>
            </div>

            <hr /><button onClick={this.test}/>

              <div className="row d-md-block">
                <h3> Ingredients </h3>
                    

                  <div className="form-group">
                    <div className="input-group">
                      <input id="amount" name="amount" type="text" className="form-control" ref="amount"/>
                      
                      <Dropdown>
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                          {this.state.dropDownValue}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item onClick={this.onDropdownClick}>L</Dropdown.Item>
                          <Dropdown.Item onClick={this.onDropdownClick}>cL</Dropdown.Item>
                          <Dropdown.Item onClick={this.onDropdownClick}>mL</Dropdown.Item>
                          
                          <Dropdown.Divider />
                          
                          <Dropdown.Item onClick={this.onDropdownClick}>Kg</Dropdown.Item>
                          <Dropdown.Item onClick={this.onDropdownClick}>g</Dropdown.Item>
                          <Dropdown.Item onClick={this.onDropdownClick}>mg</Dropdown.Item>

                          <Dropdown.Divider />

                          <Dropdown.Item onClick={this.onDropdownClick}>Piece</Dropdown.Item>

                        </Dropdown.Menu>
                      </Dropdown>

                      <input id="ingredient" name="ingredient" type="text" className="form-control" ref="ingredient"/>
                      <button className="btn btn-primary" onClick={this.onIngredientAdd}>Add Ingredient</button>
                    </div>
                  </div>
                  <AddIngredient entries={this.state.ingredients}/>
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