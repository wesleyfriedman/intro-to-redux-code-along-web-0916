import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {connect} from 'react-redux';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React Shopping List</h2>
        </div>
        <ul className="list-group col-lg-6 col-lg-offset-3">
          {this.props.shoppingListItems.map((item, i) => {
            return <li key={i} className="list-group-item">{item.description}</li>
          })}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {shoppingListItems: state.shoppingListItems}
}

export default connect(mapStateToProps)(App);
