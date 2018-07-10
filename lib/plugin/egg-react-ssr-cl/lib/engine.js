'use strict';
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const loadFile = require('./utils/loadFile');
const { inject, injectDOCType } = require('./utils/inject');
const { NodeStream, HtmlLayoutNodeStream } = require('./utils/nodeStream');
const requireUncached = require('./utils/requireUncached');

const RENDER_FUN = Symbol('Engine/renderFun');
const contentReg = /<\w+(\s+[^>]+)?\s+id\s*=\s*['|"]app['|"](\s+[^>]+)?>/;

class Engine {
  constructor(app) {
    this.app = app;
    this.config = app.config.react;
    this.initRenderFun();
  }

  initRenderFun() {
    this[RENDER_FUN] = {
      '.html': this.renderHtmlToString.bind(this),
    };
  }

  renderHtmlToString(content, layout, options) {
    let html;

    if (layout.path) {
      return loadFile(layout.path).then(data => {
        if (contentReg.test(data)) {
          html = data.replace(contentReg, match => match + content);
        } else {
          html = content;
        }
        html = inject(html, layout, options.locals);

        return html;
      }).catch(() => {
        return inject(content, layout, options.locals);
      });
    }
    return inject(content, layout, options.locals);
  }

  render(name, locals, options) {
    const reactClass = requireUncached(name, this.app);
    let html = this.renderToString(reactClass, options);

    const layout = this.app.config.clreactssr[options.layout];
    if (layout) {
      const layoutName = layout.path;
      const renderFun = this[RENDER_FUN][path.extname(layoutName)];
      if (renderFun) {
        html = renderFun(html, layout, options);
      }
    } else {
      html = injectDOCType(html, reactClass);
    }
    return Promise.resolve(html);
  }

  renderHtmlToStream(reactClass, layout, options) {
    if (layout.path) {
      return loadFile(layout.path).then(data => {
        return new HtmlLayoutNodeStream(reactClass, options, data, layout);
      }).catch(() => {
        return new HtmlLayoutNodeStream(reactClass, options, '', layout);
      });
    }
    return new HtmlLayoutNodeStream(reactClass, options, '', layout);
  }

  /**
   * 使用react16 ssr renderToNodeStream进行服务端渲染
   * @param {string} name 渲染的服务端react组件路径
   * @param {object} locals Controller调用ctx.render()传入的第二个参数，数据对象
   * @param {object} options Controller调用ctx.render()传入的第三个参数，配置选项
   * @return {Promise} 调用该函数的是async函数因此返回Promise对象，Promise对象最终返回可读流
   */
  renderStream(name, locals, options) {
    let stream;
    const reactClass = requireUncached(name, this.app);
    const layout = this.app.config.clreactssr[options.layout];
    if (layout) {
      stream = this.renderHtmlToStream(reactClass, layout, options);
    } else {
      stream = new NodeStream(reactClass, options);
    }
    return Promise.resolve(stream);
  }

  renderMarkup(name, locals) {
    const reactClass = require(name);
    return Promise.resolve(this.renderToStaticMarkup(reactClass, locals));
  }

  renderToString(reactClass, locals, children) {
    reactClass = reactClass && reactClass.default ? reactClass.default : reactClass;
    return ReactDOMServer.renderToString(React.createElement(reactClass, locals, children));
  }

  // renderToNodeStream(reactClass, locals, children) {
  //   reactClass = reactClass && reactClass.default ? reactClass.default : reactClass;
  //   return ReactDOMServer.renderToNodeStream(React.createElement(reactClass, locals, children));
  // }

  renderToStaticMarkup(reactClass, locals) {
    reactClass = reactClass && reactClass.default ? reactClass.default : reactClass;
    return ReactDOMServer.renderToStaticMarkup(React.createElement(reactClass, locals));
  }
}

module.exports = Engine;
