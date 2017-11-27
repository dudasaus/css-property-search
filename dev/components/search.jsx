import React from 'react';

class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: "",
      cssProps: [],
      searchCompletions: [],
      searchOpen: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.searchIcon = this.searchIcon.bind(this);
    this.handleIconClick = this.handleIconClick.bind(this);
    this.searchWrapperClass = this.searchWrapperClass.bind(this);
    this.spacedValue = this.spacedValue.bind(this);
    this.handleKey = this.handleKey.bind(this);
  }

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/mdn/data/master/css/properties.json')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        this.setState({cssProps: data});
        console.log('CSS property data retrieved');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleIconClick(e) {
    const searchOpen = !this.state.searchOpen;
    this.setState({
      searchOpen
    });
    if (searchOpen) {
      this.searchInput.focus();
    }
  }

  handleKey(e) {
    if (e.key === 'Enter') {
      const searchCompletions = findPotentialKeys(
        this.state.value,
        this.state.cssProps,
        5
      );
      this.setState({ searchCompletions });
    }
  }

  searchIcon() {
    let tmpClass = 'magic-icon-search';
    if (this.state.searchOpen) {
      tmpClass += ' close';
    }
    return (
      <span className={tmpClass} onClick={this.handleIconClick}></span>
    );
  }

  searchWrapperClass() {
    if (this.state.searchOpen) {
      return "search-wrapper open";
    }
    else {
      return "search-wrapper";
    }
  }

  spacedValue() {
    return this.state.value.replace(/ /g, '\u00a0');
  }

  render() {
    return (
      <div>
        <div className={ this.searchWrapperClass() }>
          <div className="search-bar">
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
              onKeyDown={this.handleKey}
              placeholder="Search..."
              ref={(input) => { this.searchInput = input }}
            />
          <span className="fancy-line">{ this.spacedValue() }</span>
          </div>
          { this.searchIcon() }
        </div>
        <ul>
          { this.state.searchCompletions.map( (x) => {
            return (<li key={x}>{x}</li>);
          })}
        </ul>
      </div>
    );
  }
}

module.exports = { Search };

function findPotentialKeys(search, cssData, k = -1) {
  let keys = Object.keys(cssData);
  let output = [];
  for (let i = 0; i < keys.length; ++i) {
    if (keys[i].substr(0, search.length) == search) {
      output.push(keys[i]);
      if (output.length == k) {
        break;
      }
    }
  }
  return output;
}
