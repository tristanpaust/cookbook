import React, { Component } from "react";
import './StepAdd.css';

import { Icon, InlineIcon } from '@iconify/react';
import crossIcon from '@iconify/icons-gridicons/cross';
import pencilIcon from '@iconify/icons-gridicons/pencil';


class StepAdd extends Component {
  constructor() {
    super();
    this.state = {
    }

    this.createItems = this.createItems.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.closeEditItem = this.closeEditItem.bind(this);
  }

  deleteItem(e) {console.log(e.target.id)
    this.props.onHandleDelete(e.target.id);
  }

  editItem(e) {
    this.props.onHandleEdit(e.target.parentNode.firstChild);
  }

  closeEditItem(e) {
    this.props.onHandleBlur(e.target.parentNode.firstChild, e.target.parentNode.children[2].id);
  }

  createItems(item) {
    return (
      <li key={item.key}>
        <p className="step-item" onBlur={this.closeEditItem}>{item.text}</p>
        <span className="step-icon-container" onClick={this.editItem}>
          <Icon icon={pencilIcon} className="step-icon"/>
        </span>
        <span id={item.key} onClick={this.deleteItem} className="step-icon-container">
          <Icon icon={crossIcon} className="step-icon"/>
        </span>
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
 
export default StepAdd;