import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ListGroup from './common/listGroup';
import Pagination from './common/pagination';
import SearchBox from './common/searchBox';
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
    searchQuery: '',
    selectedGenre: null,
    sortColumn: { path: 'title', order: 'asc' }
  }

  componentDidMount() {
    const allGenres = { _id: '', name: 'All Genres' };
    const genres = [ allGenres, ...getGenres() ]

    const movies = getMovies();
    console.log(movies);

    this.setState({ movies, genres, selectedGenre: allGenres });
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
    this.setState({ selectedGenre: genre, searchQuery: '', currentPage: 1 });
  }

  handleSearch = query => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  }

  getPagedData() {
    const { movies, selectedGenre, currentPage, pageSize, sortColumn, searchQuery } = this.state;

    let filteredMovies = movies;

    if (searchQuery)
      filteredMovies = movies.filter(movie => movie.title.toLowerCase().startsWith(searchQuery.toLowerCase()));
    else if (selectedGenre && selectedGenre._id)
      filteredMovies = movies.filter(movie => movie.genre._id === selectedGenre._id);

    const sortedMovies = _.orderBy(filteredMovies, [sortColumn.path], [sortColumn.order]);
    const data = paginate(sortedMovies, currentPage, pageSize);

    return { totalCount: filteredMovies.length, data };
  }

  render() { 
    const { currentPage, pageSize, sortColumn, searchQuery } = this.state;

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
          <Link className="btn btn-primary" style={{ marginBottom: 20 }} to="/movies/new">New Movie</Link>
          <div>Showing {totalCount} movies in the database.</div>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
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
