import React, { Component } from "react";

import SearchUnit from './SearchUnit.jsx';

class AddIngredient extends Component {
    constructor() {
    super();
    this.state = {
      units: []
    }
    this.createItems = this.createItems.bind(this);
  }

  createItems(item) {
    return <li key={item.value}><div className="input-group"><input type="number"/><SearchUnit onSelectUnit={this.handleUnitSelect}/> {item.label}</div></li>
  }
 
  handleUnitSelect(options) {
    this.setState({units: options});
    console.log(this.state.units);
  }

  render() {
    var ingredientEntries = this.props.entries;
    console.log(ingredientEntries)
    var listItems = ingredientEntries.map(this.createItems);
 
    return (
      <ul className="ingredient-list">
        {listItems}
      </ul>
    );
  }
};
 
export default AddIngredient;