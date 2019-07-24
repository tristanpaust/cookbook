import React, { Component } from "react";
 
class AddStep extends Component {
  createItems(item) {
    return <li key={item.key}>{item.text}</li>
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