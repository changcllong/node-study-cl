'use strict';
const url = require('url');

const htmlReg = /(<html[^>]*>)/i;
const headReg = /(<\/head\s*>)/i;
const bodyReg = /(<\/body\s*>)/i;
const docTypeReg = /(<!doctype\s+html\s*>)/i;

function injectHeadTag(html, inject, locals, publicPath) {
  let injectHead = [];

  if (inject.locals) {
    injectHead.push(`<script>window.${inject.locals}='${JSON.stringify(locals)}';</script>`);
  }
  if (Array.isArray(inject.css)) {
    injectHead = injectHead.concat(inject.css.map(name => {
      const fullUrl = url.resolve(publicPath || '', name);
      return `<link href="${fullUrl}" rel="stylesheet">`;
    }));
  }

  if (Array.isArray(injectHead) && injectHead.length > 0) {
    if (!headReg.test(html)) {
      if (!htmlReg.test(html)) {
        html = '<head></head>' + html;
      } else {
        html = html.replace(htmlReg, match => match + '<head></head>');
      }
    }
    html = html.replace(headReg, match => injectHead.join('') + match);
  }
  return html;
}

function injectBodyTag(html, inject, publicPath) {
  let injectBody = [];

  if (Array.isArray(inject.js)) {
    injectBody = inject.js.map(name => {
      const fullUrl = url.resolve(publicPath || '', name);
      return `<script src="${fullUrl}"></script>`;
    });
  }

  if (Array.isArray(injectBody) && injectBody.length > 0) {
    if (bodyReg.test(html)) {
      html = html.replace(bodyReg, match => { return injectBody.join('') + match; });
    } else {
      html += injectBody.join('');
    }
  }
  return html;
}

module.exports = {
  inject(html, layoutConfig, locals) {
    const {
      inject,
    } = layoutConfig;

    if (!inject) {
      return html;
    }

    let {
      publicPath,
    } = inject;

    if (publicPath && publicPath.length && publicPath.substr(-1, 1) !== '/') {
      publicPath += '/';
    }

    html = injectHeadTag(html, inject, locals, publicPath);

    html = injectBodyTag(html, inject, publicPath);

    return html;
  },

  injectDOCType(html, reactClass) {
    let doctype = '<!doctype html>';

    if (reactClass && typeof reactClass.getDOCType === 'function') {
      doctype = reactClass.getDOCType();
    }
    if (html.search(docTypeReg) !== 0) {
      return doctype + html;
    }

    return html;
  },

  injectHead(html, layoutConfig, locals) {
    const {
      inject,
    } = layoutConfig;

    if (!inject) {
      return html;
    }

    let {
      publicPath,
    } = inject;

    if (publicPath && publicPath.length && publicPath.substr(-1, 1) !== '/') {
      publicPath += '/';
    }

    return injectHeadTag(html, inject, locals, publicPath);
  },

  injectBody(html, layoutConfig) {
    const {
      inject,
    } = layoutConfig;

    if (!inject) {
      return html;
    }

    let {
      publicPath,
    } = inject;

    if (publicPath && publicPath.length && publicPath.substr(-1, 1) !== '/') {
      publicPath += '/';
    }

    return injectBodyTag(html, inject, publicPath);
  },
};
