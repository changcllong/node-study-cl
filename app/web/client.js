import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import Test from './test';

const locals = JSON.parse(window._INIT_STORE_);

const PlaceHolder = () => {
  return (<p>HELLO SSR!!</p>);
}

class Index extends Component {
  getChildContext() {
    return { list: locals.list };
  }

  render() {
    return (
      <div>
        <HashRouter>
          <section>
            <Route exact path="/" component={Test}/>
            <Route path="/tip" component={PlaceHolder}/>
          </section>
        </HashRouter>
      </div>
    );
  }
}

Index.childContextTypes = {
  list: PropTypes.array
};

ReactDOM.hydrate(
  (
    <Index />
  ),
  document.getElementById('app')
);