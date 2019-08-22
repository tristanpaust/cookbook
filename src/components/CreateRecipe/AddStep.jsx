import React, { Component } from "react";
import '../../css/AddStep.css';

class AddStep extends Component {
  constructor() {
    super();
    this.state = {
    }

    this.createItems = this.createItems.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.closeEditItem = this.closeEditItem.bind(this);
  }

  deleteItem(e) {
    this.props.onHandleDelete(e.target.id);
  }

  editItem(e) {
    this.props.onHandleEdit(e.target.parentNode.firstChild, e.target.parentNode.children[1]);
  }

  closeEditItem(e) {
    this.props.onHandleBlur(e.target.parentNode.firstChild, e.target.parentNode.children[1]);
  }

  createItems(item) {
    return (
      <li key={item.key}>
        <p className="step-item" onBlur={this.closeEditItem}>{item.text}</p>
        <span className="oi oi-pencil edit-step-icon" onClick={this.editItem}></span>
        <span id={item.key} className="oi oi-x remove-step-icon" onClick={this.deleteItem}></span>
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