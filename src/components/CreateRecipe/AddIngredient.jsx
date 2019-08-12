import React, { Component } from "react";

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
        <p>{element.amount}</p>
        <p>{element.unit.label}</p>        
        <p>{element.item.label}</p>
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