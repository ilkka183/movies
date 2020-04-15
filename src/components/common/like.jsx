import React, { Component } from 'react';

export default class Like extends Component {
  get classes() {
    let classes = 'fa fa-heart';

    if (!this.props.liked)
      classes += '-o';

    return classes;
  }

  render() { 
    return (
      <i
        className={this.classes}
        style={{ cursor: 'pointer' }}
        aria-hidden="true"
        onClick={this.props.onClick}
      ></i>
    );
  }
}
