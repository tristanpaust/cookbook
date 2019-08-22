import React, { Component } from "react";

import '../../css/AddIngredient.css';

class AddIngredient extends Component {
    constructor() {
    super();
    this.state = {
    }

    this.createItems = this.createItems.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  deleteItem(e) {
    this.props.onHandleDelete(e.target.id);
  }
  
  createItems(element) {
    return (
      <li className="row" key={element.item.value}>
        <p><b>{element.amount} {element.unit.label}</b> {element.item.label}</p>
        <span id={element.item.value} className="remove-ingredient" aria-hidden="true" onClick={this.deleteItem}>&times;</span>
      </li> 

    )
  }

  render() {
    var ingredientEntries = this.props.entries;
    console.log(ingredientEntries);
    var listItems = ingredientEntries.map(this.createItems);
 
    return (
      <ul className="ingredient-list">
        {listItems}
      </ul>
    );
  }
};
 
export default AddIngredient;