import React from "react";

export default class Switch extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.onUserChange(
      !this.props.percentageEnabled
    );
  }

  render() {
    return (
      <p>
        <label>
          Show percentage
          {' '}
          <input
            type="checkbox"
            checked={this.props.percentageEnabled}
            onChange={this.handleChange}
          />
        </label>
      </p>
    );
  }
}
