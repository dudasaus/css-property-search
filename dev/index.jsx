import React from 'react';
import {render} from 'react-dom';
import { Search } from './components/search.jsx';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <h1 className="app-title">CSS Property Search</h1>
        <Search/>
      </div>
    );
  }
}

render(<App/>, document.querySelector('#app'));
