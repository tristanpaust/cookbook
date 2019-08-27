import React, { Component } from "react";
 
class AddTag extends Component {
  createItems(item) {
    return <li key={item.key}>{item.text}</li>
  }
 
  render() {
    var tagEntries = this.props.entries;
    var listItems = tagEntries.map(this.createItems);
 
    return (
      <ul className="tag-list">
          {listItems}
      </ul>
    );
  }
};
 
export default AddTag;