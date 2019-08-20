import React, { Component } from 'react'
import '../../css/Progress.css'

class Progress extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className="ProgressWrapper">
        <span
          className="oi oi-x CrossIcon"
          onClick={this.props.removeImage}
          style={{
            opacity:
              this.props.progress / 100
          }}
        />       
        <div className="ProgressBar">
          <div
            className="Progress"
            style={{ width: this.props.progress + '%' }}
          />       
          </div>
        <span
          className="oi oi-check CheckIcon"
          style={{
            opacity:
              this.props.progress / 100
          }}
        /> 
      </div>
    )
  }
}

export default Progress