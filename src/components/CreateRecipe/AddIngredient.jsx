import React, { Component } from "react";
 
class AddIngredient extends Component {
  createItems(item) {
    return <li key={item.key}>{item.text}</li>
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