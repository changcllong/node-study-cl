'use strict';
class View {
  constructor(ctx) {
    this.ctx = ctx;
    this.app = ctx.app;
  }

  render(name, locals, options = {}) {
    this.ctx.type = 'text/html; charset=utf-8';
    return this.app.react.renderStream(name, locals, options);
  }

  /* eslint no-unused-vars:off */
  /* istanbul ignore next */
  renderString(tpl, locals) {
    return Promise.reject('not implemented yet!');
  }
}

module.exports = View;
