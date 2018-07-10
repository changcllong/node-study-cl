'use strict';

const { Readable } = require('stream');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const { inject, injectHead, injectBody } = require('./inject');

class NodeStream extends Readable {
  constructor(reactClass, options) {
    super();
    this.reactClass = reactClass;
    this.options = options;

    this.nodeStream = this.renderToNodeStream(reactClass, options);
    this._readFun = this._pushDocType;
  }

  renderToNodeStream(reactClass, locals, children) {
    reactClass = reactClass && reactClass.default ? reactClass.default : reactClass;
    return ReactDOMServer.renderToNodeStream(React.createElement(reactClass, locals, children));
  }

  to(data, fun) {
    this._readFun = fun;
    return this.push(data);
  }

  _pushDocType() {
    let doctype = '<!doctype html>';
    const {
      reactClass,
      _pushContent,
    } = this;

    if (reactClass && typeof reactClass.getDOCType === 'function') {
      doctype = reactClass.getDOCType();
    }
    this.to(doctype, _pushContent);
  }

  _pushContent() {
    this._readFun = this._noop;

    this.nodeStream.on('data', chunk => {
      if (!this.push(chunk)) {
        this.nodeStream.pause();
        this._readFun = this._resumeStream;
      }
    });

    this.nodeStream.on('end', () => {
      this.to(this._getHtmlAfter(), this._pushNull);
    });
  }

  _getHtmlAfter() {
    return ' ';
  }

  _pushNull() {
    this.push(null);
  }

  _resumeStream() {
    this.nodeStream.resume();
  }

  _noop() {}

  _read() {
    this._readFun.call(this);
  }
}

class HtmlLayoutNodeStream extends NodeStream {
  constructor(reactClass, options, layoutHtml, layout) {
    super(reactClass, options);
    this.layoutHtml = layoutHtml || '';
    this.layout = layout;

    // TODO: config id;
    const contentReg = /<\w+(\s+[^>]+)?\s+id\s*=\s*['|"]app['|"](\s+[^>]+)?>/;

    const matchs = this.layoutHtml.match(contentReg);
    if (Array.isArray(matchs)) {
      this.contentTag = matchs[0];
      this.layoutHtmls = this.layoutHtml.split(contentReg);
    } else {
      this.contentTag = ' ';
      this.layoutHtmls = [ '', '' ];
    }

    this._readFun = this._pushHtmlBefore;
  }

  _pushHtmlBefore() {
    const {
      layoutHtmls,
      layout,
      options,
      _pushContentTag,
      _pushNull,
    } = this;
    let html;
    if (layoutHtmls.length > 1) {
      html = injectHead(layoutHtmls[0], layout, options.locals);
      this.to(html, _pushContentTag);
    } else {
      html = inject(layoutHtmls[0], layout, options.locals);
      this.to(html, _pushNull);
    }
  }

  _pushContentTag() {
    this.to(this.contentTag, this._pushContent);
  }

  _getHtmlAfter() {
    return injectBody(this.layoutHtmls.slice(1).join(''), this.layout);
  }
}

module.exports = {
  NodeStream,
  HtmlLayoutNodeStream,
};
