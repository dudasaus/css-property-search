import React from 'react';

class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: "",
      cssProps: [],
      searchCompletions: []
    };

    this.handleChange = this.handleChange.bind(this);
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

  render() {
    return (
      <div>
        <input type="text" value={this.state.value} onChange={this.handleChange} />
      </div>
    );
  }
}

module.exports = { Search };
