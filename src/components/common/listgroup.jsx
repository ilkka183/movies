import React, { Component } from 'react';

export default class ListGroup extends Component {
  render() {
    const { items, valueProperty, textProperty, selectedItem, onItemSelect } = this.props;

    return (
      <ul className="list-group">
        { items.map(item => (
          <li
            className={ item === selectedItem ? 'list-group-item active' : 'list-group-item' }
            key={item[valueProperty]}
            onClick={() => onItemSelect(item)}
          >
            {item[textProperty]}
          </li>
        ))}
      </ul>      
    );
  }
}

ListGroup.defaultProps = {
  textProperty: 'name',
  valueProperty: '_id',
}
