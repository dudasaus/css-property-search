import React from 'react';

class Search extends React.Component {

  constructor(props) {
    super(props);

    // Set the initial state
    this.state = {
      value: "",
      cssProps: [],
      currentProperty: null,
      placeholder: "Loading...",
      searchCompletions: [],
      currentCompletion: -1,
      searchOpen: false
    };

    // Other vars
    this.completionTimer = null;

    // Function binding
    this.handleChange = this.handleChange.bind(this);
    this.searchIcon = this.searchIcon.bind(this);
    this.handleIconClick = this.handleIconClick.bind(this);
    this.searchWrapperClass = this.searchWrapperClass.bind(this);
    this.spacedValue = this.spacedValue.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.updateCompletionsFunc = this.updateCompletionsFunc.bind(this);
    this.displayProperty = this.displayProperty.bind(this);
    this.mouseEnterCompletionFunc = this.mouseEnterCompletionFunc.bind(this);
    this.mouseEnterCompletionFunc = this.mouseEnterCompletionFunc.bind(this);
    this.setCurrentProperty = this.setCurrentProperty.bind(this);
  }

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/mdn/data/master/css/properties.json')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        this.setState({
          cssProps: data,
          placeholder: 'Search'
        });
        console.log('CSS property data retrieved');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange(e) {
    const value = e.target.value;
    this.setState({
      value,
      currentCompletion: -1
    });
    if (this.completionTimer !== null) {
      clearTimeout(this.completionTimer);
    }
    this.completionTimer = setTimeout(this.updateCompletionsFunc(value), 300);
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
      let value = this.state.value;
      let searchCompletions = this.state.searchCompletions;
      if (this.state.currentCompletion != -1) {
        this.setCurrentProperty(searchCompletions[this.state.currentCompletion]);
      }
      else {
        this.setCurrentProperty(value);
      }
    }
    let currentCompletion = this.state.currentCompletion;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentCompletion < this.state.searchCompletions.length - 1) {
        ++currentCompletion;
        this.setState({ currentCompletion });
      }
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentCompletion > -1) {
        --currentCompletion;
        this.setState({ currentCompletion });
      }
    }
  }

  updateCompletionsFunc(val) {
    return () => {
      let searchCompletions = [];
      if (val) {
          searchCompletions = findPotentialKeys(
          val,
          this.state.cssProps,
          5
        );
      }
      this.setState({ searchCompletions, currentCompletion: -1 });
    }
  }

  mouseEnterCompletionFunc(idx) {
    return () => {
      this.setState({
        currentCompletion: idx
      });
    }
  }

  mouseClickCompletionFunc(name) {
    return () => {
      this.setCurrentProperty(name);
    }
  }

  setCurrentProperty(name) {
    const currentProperty = name;
    if (this.state.cssProps[currentProperty]) {
      this.setState({
        currentProperty,
        value: name,
        currentCompletion: -1,
        searchCompletions: []
      });
    }
  }

  displaySearchCompletions() {
    if (this.state.searchOpen) {
      return (
        <div className="search-completions">
          { this.state.searchCompletions.map( (val, index) => {
            const mef = this.mouseEnterCompletionFunc(index);
            const mcf = this.mouseClickCompletionFunc(val);
            return (
              <div
                key={index}
                className={"completion" + ((index === this.state.currentCompletion) ? " active" : "")}
                onMouseEnter={mef}
                onClick={mcf}
              >
                {val}
              </div>
            );
          })}
        </div>
      );
    }
    else {
      return null;
    }
  }

  displayProperty() {
    if (this.state.currentProperty === null) {
      return null;
    }
    else {
      const p = this.state.cssProps[this.state.currentProperty];
      const display = Object.keys(p).map((key, i) => {
        return (
          <tr key={i}>
            <th>{keyConversion[key]}</th>
            <td>{p[key].toString()}</td>
          </tr>
        );
      });
      return (
        <div className="property">
          <h1>{this.state.currentProperty}</h1>
          <table>
            <tbody>
              {display}
            </tbody>
          </table>
        </div>
      );
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
              placeholder={this.state.placeholder}
              ref={(input) => { this.searchInput = input }}
            />
          <span className="fancy-line">{ this.spacedValue() }</span>
          </div>
          { this.searchIcon() }
          { this.displaySearchCompletions() }
        </div>
        { this.displayProperty() }
      </div>
    );
  }
}

module.exports = { Search };

function findPotentialKeys(search, cssData, k = -1) {
  let keys = Object.keys(cssData);
  let output = [];
  for (let i = 0; i < keys.length; ++i) {
    if (keys[i].substr(0, search.length) == search && keys[i].length > search.length) {
      output.push(keys[i]);
      if (output.length == k) {
        break;
      }
    }
  }
  return output;
}

const keyConversion = {
  "syntax": "Syntax",
  "media": "Media",
  "inherited": "Inherited",
  "animationType": "Animation type",
  "percentages": "Percentages",
  "groups": "Groups",
  "initial": "Initial",
  "appliesto": "Applies to",
  "alsoAppliesTo": "Also applies to",
  "computed": "Computed",
  "order": "Order",
  "status": "Status",
  "stacking": "Stacking"
}
