import React, { Component } from "react";
import '../../css/AddStep.css';

class AddStep extends Component {
  createItems(item) {
    return <li key={item.key}><p>{item.text}</p></li>
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