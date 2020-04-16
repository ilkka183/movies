import React, { Component } from 'react';
import _ from 'lodash';

export default class TableBody extends Component {
  createRowKey(item) {
    return item._id;
  }

  createCellKey(item, column) {
    return item._id + (column.path || column.key);
  }

  renderCell(item, column) {
    if (column.content)
      return column.content(item);

    return _.get(item, column.path);
  }

  render() { 
    const { data, columns } = this.props;

    return (
      <tbody>
        {data.map(item =>
          <tr key={this.createRowKey(item)}>
            {columns.map(column => <td key={this.createCellKey(item, column)}>{this.renderCell(item, column)}</td>)}
          </tr>
        )}
      </tbody>
    );
  }
}
