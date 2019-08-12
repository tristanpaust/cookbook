import React, { Component } from "react";

import '../../css/AddIngredient.css';

class AddIngredient extends Component {
    constructor() {
    super();
    this.state = {

    }
    this.createItems = this.createItems.bind(this);
  }
  
  createItems(element) {
    return (
      <li className="row" key={element.item.value}>
        <p><b>{element.amount} {element.unit.label}</b> {element.item.label}</p>
        <span class="remove-ingredient" aria-hidden="true">&times;</span>
      </li> 

    )
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