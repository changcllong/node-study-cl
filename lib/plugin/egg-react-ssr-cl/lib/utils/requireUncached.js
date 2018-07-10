'use strict';

module.exports = function requireUncached(module, app) {
  if (app.config.env === 'local') {
    delete require.cache[require.resolve(module)];
  }
  return require(module);
};
