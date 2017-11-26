import React from 'react';
import {render} from 'react-dom';
import { Search } from './components/search.jsx';

class App extends React.Component {
  render() {
    return (
      <Search/>
    )
  }
}

render(<App/>, document.querySelector('#app'));
