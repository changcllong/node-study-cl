'use strict';
class View {
  constructor(ctx) {
    this.ctx = ctx;
    this.app = ctx.app;
  }

  render(name, locals, options = {}) {
    return this.app.react.render(name, locals, options);
  }

  /* eslint no-unused-vars:off */
  /* istanbul ignore next */
  renderString(tpl, locals) {
    return Promise.reject('not implemented yet!');
  }
}

module.exports = View;
