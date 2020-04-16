import React, { Component } from 'react';
import TableHeader from './tableHeader';
import TableBody from './tableBody';

export default class Table extends Component {
  render() { 
    const { columns, sortColumn, data, onSort } = this.props;

    return (
      <table className="table">
        <TableHeader columns={columns} sortColumn={sortColumn} onSort={onSort} />
        <TableBody columns={columns} data={data} />
      </table>
    );
  }
}
