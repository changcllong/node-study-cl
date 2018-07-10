import React, { Component } from 'react';
import { StaticRouter, Route } from 'react-router';
import Layout from './layout';
import PropTypes from 'prop-types';
import Test from './test';

const PlaceHolder = () => {
  return (<p>HELLO SSR!!</p>);
}

export default class Index extends Component {
  getChildContext() {
    return { list: this.props.locals.list };
  }

  render() {
    const {
      url
    } = this.props;

    // <Layout locals={this.props.locals}>
    // </Layout>
    return (
      <Layout locals={this.props.locals}>
        <div>
          <StaticRouter location={url} context={{}}>
            <section>
              <Route exact path="/" component={Test}/>
              <Route path="/tip" component={PlaceHolder}/>
            </section>
          </StaticRouter>
        </div>
      </Layout>
    );
  }
}

Index.childContextTypes = {
  list: PropTypes.array
};
