import React, { Component } from 'react';

export default class Input extends Component {
  render() { 
    const { name, label, value, onChange } = this.props;

    return (
      <div className="form-group">
        <label htmlFor={name}>{ label }</label>
        <input
          className="form-control"
          id={name}
          name={name}
          type="text"
          value={value}
          onChange={onChange}
        />
      </div>
    );
  }
}
