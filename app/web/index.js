import React, { Component } from 'react';
import { StaticRouter, Route } from 'react-router'
import PropTypes from 'prop-types';
import Test from './test';

const PlaceHolder = () => {
  return (<p>HELLO SSR!!</p>);
}

export default class Index extends Component {
  getChildContext() {
    return { list: this.props.list };
  }

  render() {
    const {
      list,
      url
    } = this.props;
    return (
      <div>
        <StaticRouter location={url} context={{}}>
          <section>
            <Route exact path="/" component={Test}/>
            <Route path="/tip" component={PlaceHolder}/>
          </section>
        </StaticRouter>
      </div>
    );
  }
}

Index.childContextTypes = {
  list: PropTypes.array
}
