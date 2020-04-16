import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Pagination extends Component {
  render() {
    const { itemsCount, pageSize, currentPage, onPageChange } = this.props;

    const pagesCount = Math.ceil(itemsCount/pageSize);
  
    if (pagesCount === 1)
      return null;
  
    const pages = [];
  
    for (let i = 1; i <= pagesCount; i++)
      pages.push(i);
  
    return (
      <nav>
        <ul className="pagination">
          {pages.map(page => (
            <li className={ page === currentPage ? 'page-item active' : 'page-item' } key={page}>
              <span className="page-link" onClick={() => onPageChange(page)}>{page}</span>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}
  
Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
}
