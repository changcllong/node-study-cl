import React, { Component } from 'react';

export default class Layout extends Component {

  render() {
    return (
      <html lang="en">
      <head>
        <meta charSet="utf-8"></meta>
        <title>ssr layout</title>
        <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui"></meta>
        <script dangerouslySetInnerHTML={{__html: `window._INIT_STORE_='${JSON.stringify(this.props.locals)}';`}}></script>
      </head>
      <body>
        <div id="app">{this.props.children}</div>
        <script src="assets/manifest.js"></script>
        <script src="assets/vendor.js"></script>
        <script src="assets/index.js"></script>
      </body>
      </html>
    );
  }
}
