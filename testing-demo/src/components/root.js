import React from 'react';

const Root = React.createClass({
  getInitialState() {
    return {
      name: ''
    };
  },

  handleChange(e) {
    this.setState({
      name: e.target.value
    });
  },

  onClick(str) {
    if (str === 'aa') {
      console.log(1);
    } else {
      console.log(2);
    }
  },

  render() {
    return (<div>
      <h1>Hello World!!</h1>
      <p>
        Please input your name here:
        <input onChange={this.handleChange} value={this.state.name} />
      </p>
      <p className="helloP">Hello, {this.state.name}</p>
      <button onClick={this.onClick.bind(this, 'aa')}>click</button>
    </div>);
  }

});

export default Root;
