import React, { Component } from "react";
import '../../css/AddStep.css';

class AddStep extends Component {
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

  createItems(item) {
    return (
      <li key={item.key}>
        <span className="oi oi-pencil edit-step-icon"></span>
        <span id={item.key} className="oi oi-x remove-step-icon" onClick={this.deleteItem}></span>
        <p>{item.text}</p>
      </li>
    )
  }
 
  render() {
    var stepEntries = this.props.entries;
    var listItems = stepEntries.map(this.createItems);
 
    return (
      <ol className="step-list">
          {listItems}
      </ol>
    );
  }
};
 
export default AddStep;