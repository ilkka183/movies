import React, { Component } from 'react';
import Like from './common/like';
import ListGroup from './common/listgroup';
import Pagination from './common/pagination';
import { getMovies } from '../services/fakeMovieService';
import { getGenres } from '../services/fakeGenreService';
import paginate from '../utils/paginate';

export default class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
    selectedGenre: null
  }

  componentDidMount() {
    const genres = [ { _id: 0, name: 'All Genres' }, ...getGenres() ]

    this.setState({ movies: getMovies(), genres });
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

  handlePageChange = page => {
    this.setState({ currentPage: page });
  }

  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, currentPage: 1 });
  }

  renderListGroup() {
    return <ListGroup
      items={this.state.genres}
      selectedItem={this.state.selectedGenre}
      onItemSelect={this.handleGenreSelect}/>
  }

  renderMovies() {
    const { movies, selectedGenre, currentPage, pageSize } = this.state;

    const filteredMovies =
      selectedGenre && selectedGenre._id ?
      movies.filter(movie => movie.genre._id === selectedGenre._id) :
      movies;

    const pagedMovies = paginate(filteredMovies, currentPage, pageSize);

    return (
      <>
        <div>Showing {filteredMovies.length} movies in the database.</div>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Genre</th>
              <th>Stock</th>
              <th>Rate</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pagedMovies.map(movie =>
              <tr key={movie._id}>
                <td>{movie.title}</td>
                <td>{movie.genre.name}</td>
                <td>{movie.numberInStock}</td>
                <td>{movie.dailyRentalRate}</td>
                <td><Like liked={movie.liked} onClick={() => this.handleLike(movie)}/></td>
                <td><button className="btn btn-danger btn-sm" onClick={() => this.handleDelete(movie)}>Delete</button></td>
              </tr>)}
          </tbody>
        </table>
        <Pagination
          itemsCount={filteredMovies.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
        />
      </>
    );
  }

  render() { 
    if (this.state.movies.length === 0)
      return <div>There are no movies in the database.</div>

    return (
      <div className="row">
        <div className="col-3">
          { this.renderListGroup() }
        </div>
        <div className="col">
          { this.renderMovies() }
        </div>
      </div>
    );
  }
}
