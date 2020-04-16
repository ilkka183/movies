import React, { Component } from 'react';
import ListGroup from './common/listGroup';
import Pagination from './common/pagination';
import MoviesTable from './moviesTable';
import { getMovies } from '../services/fakeMovieService';
import { getGenres } from '../services/fakeGenreService';
import paginate from '../utils/paginate';
import _ from 'lodash';

export default class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
    selectedGenre: null,
    sortColumn: { path: 'title', order: 'asc' }
  }

  componentDidMount() {
    const allGenres = { _id: '', name: 'All Genres' };
    const genres = [ allGenres, ...getGenres() ]

    this.setState({ movies: getMovies(), genres, selectedGenre: allGenres });
  }

  handleLike = movie => {
    const movies = this.state.movies.map(item => {
      if (item === movie)
        item.liked = !item.liked;
        
      return item;
    });
    
    this.setState({ movies });
  }

  handleDelete = movie => {
    const movies = this.state.movies.filter(item => item._id !== movie._id);

    this.setState({ movies });
  }

  handleSortColumn = sortColumn => {
    this.setState({ sortColumn });
  }

  handlePageChange = page => {
    this.setState({ currentPage: page });
  }

  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, currentPage: 1 });
  }

  getPagedData() {
    const { movies, selectedGenre, currentPage, pageSize, sortColumn } = this.state;

    const filteredMovies =
      selectedGenre && selectedGenre._id ?
      movies.filter(movie => movie.genre._id === selectedGenre._id) :
      movies;

    const sortedMovies = _.orderBy(filteredMovies, [sortColumn.path], [sortColumn.order]);
    const data = paginate(sortedMovies, currentPage, pageSize);

    return { totalCount: filteredMovies.length, data };
  }

  render() { 
    const { currentPage, pageSize, sortColumn } = this.state;

    if (this.state.movies.length === 0)
      return <div>There are no movies in the database.</div>

    const { totalCount, data: movies } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.genres}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          <div>Showing {totalCount} movies in the database.</div>
          <MoviesTable
            movies={movies}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSortColumn}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}
