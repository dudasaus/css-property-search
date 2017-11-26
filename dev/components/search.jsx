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
  }

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/mdn/data/master/css/properties.json')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        this.setState({cssProps: data});
        console.log('Data retrieved');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleIconClick(e) {
    console.log('Icon click');
    this.setState({
      searchOpen: !this.state.searchOpen
    })
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

  render() {
    return (
      <div>
        <h1>CSS Property Search</h1>
        <div className={ this.searchWrapperClass() }>
          <div className="search-bar">
            <input type="text" value={this.state.value} onChange={this.handleChange} placeholder="Search..." />
          </div>
          { this.searchIcon() }
        </div>
      </div>
    );
  }
}

module.exports = { Search };
