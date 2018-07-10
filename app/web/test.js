import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Test extends Component {
  render() {
    return (
      <ul>
        {this.context.list.map(item => {
          return <li key={item}>列表第 {item} 项!</li>;
        })}
      </ul>
    );
  }
}

Test.contextTypes = {
  list: PropTypes.array
};
