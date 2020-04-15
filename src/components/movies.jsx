import React, { Component } from 'react';
import { getMovies } from '../services/fakeMovieService';

export default class Movies extends Component {
  state = {
    movies: getMovies()
  }

  handleDelete = movie => {
    const movies = this.state.movies.filter(item => item._id !== movie._id);
    this.setState({ movies });
  }

  renderMovies() {
    return <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Genre</th>
            <th>Stock</th>
            <th>Rate</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {this.state.movies.map(movie =>
            <tr key={movie._id}>
              <td>{movie.title}</td>
              <td>{movie.genre.name}</td>
              <td>{movie.numberInStock}</td>
              <td>{movie.dailyRentalRate}</td>
              <td><button className="btn btn-danger btn-sm" onClick={() => this.handleDelete(movie)}>Delete</button></td>
            </tr>)}
        </tbody>
      </table>
  }

  render() { 
    if (this.state.movies.length === 0)
      return <div>There are no movies in the database.</div>

    return (
      <>
        <div>Showing {this.state.movies.length} movies in the database.</div>
        { this.state.movies.length > 0 && this.renderMovies()}
      </>
    );
  }
}
