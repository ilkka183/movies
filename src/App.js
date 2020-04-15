import React, { Component } from 'react';
import Movies from './components/movies';

export default class App extends Component {
  render() { 
    return (
      <div className="container">
        <Movies />
      </div>
    );
  }
}
