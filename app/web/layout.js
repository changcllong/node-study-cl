import React, { Component } from 'react';

export default class Layout extends Component {
  render() {
    return (
      <html>
      <head>
        <meta charSet="utf-8"></meta>
        <title>ssr layout</title>
        <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui"></meta>
      </head>
      <body><div id="app">{this.props.children}</div></body>
      </html>
    );
  }
}
