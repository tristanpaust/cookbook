import React, { Component } from "react";

import SearchUnit from './SearchUnit.jsx';

class AddIngredient extends Component {
    constructor() {
    super();
    this.state = {
      unit: undefined,
      amount: undefined,
      item: undefined,
      ingredients: [],
    }
    this.createItems = this.createItems.bind(this);
    this.handleUnitSelect = this.handleUnitSelect.bind(this);
    this.getAmount = this.getAmount.bind(this);
    this.getAllIngredients = this.getAllIngredients.bind(this)
  }
  componentDidMount() {
    this.props.onRef(this)
  }
  componentWillUnmount() {
    this.props.onRef(undefined)
  }
  getAllIngredients() {
    // Create new object from all parts: on ingredient has an amount, a unit and a name
    // Push all of them to array and pass to parent controller
    var ingredient = {};
    ingredient.amount = this.state.amount;
    ingredient.unit = this.state.unit;
    ingredient.item = this.state.item;
    this.state.ingredients.push(ingredient);
    return this.state.ingredients;
  }

  getAmount(element,e) {
    // Store amount, as well as actual ingredient name and ID in state
    this.setState({amount: e.target.value});
    this.setState({item: element});
  }

  createItems(element) {
    return (
      <li className="row" key={element.value}>
        <div className="input-group col">
          <input type="number" step="0.01" className="col" onChange={(e) => this.getAmount(element, e)}/>
          <SearchUnit onSelectUnit={this.handleUnitSelect}/> 
          <p>{element.label}</p>
        </div>
      </li> 
      )
  }
 
  handleUnitSelect(options) {
    this.setState({unit: options});
  }

  render() {
    var ingredientEntries = this.props.entries;
    var listItems = ingredientEntries.map(this.createItems);
 
    return (
      <ul className="ingredient-list">
        {listItems}
      </ul>
    );
  }
};
 
export default AddIngredient;