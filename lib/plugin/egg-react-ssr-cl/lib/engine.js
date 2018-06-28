'use strict';
const React = require('react');
const ReactDOMServer = require('react-dom/server');

class Engine {
  constructor(app) {
    this.app = app;
    this.config = app.config.react;
  }

  render(name, locals, options) {
    console.log(options);
    const layoutName = this.app.config.clreactssr.layout[locals.layout || 'main'];
    const reactClass = require(name);
    const layoutReactClass = require(layoutName);
    if (layoutReactClass) {
      const children = reactClass ? React.createElement(reactClass.default || reactClass, locals) : null;
      return Promise.resolve(this.renderToString(layoutReactClass, locals, children));
    }
    return Promise.resolve(this.renderToString(reactClass, locals));
  }

  renderMarkup(name, locals) {
    const reactClass = require(name);
    return Promise.resolve(this.renderToStaticMarkup(reactClass, locals));
  }

  renderToString(reactClass, locals, children) {
    reactClass = reactClass && reactClass.default ? reactClass.default : reactClass;
    return ReactDOMServer.renderToString(React.createElement(reactClass, locals, children));
  }

  renderToStaticMarkup(reactClass, locals) {
    reactClass = reactClass && reactClass.default ? reactClass.default : reactClass;
    return ReactDOMServer.renderToStaticMarkup(React.createElement(reactClass, locals));
  }
}

module.exports = Engine;
