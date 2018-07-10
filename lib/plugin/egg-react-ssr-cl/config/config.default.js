'use strict';

const path = require('path');

module.exports = app => {
  const config = {};

  config.view = {
    mapping: {
      '.js': 'react',
      '.jsx': 'react',
    },
  };

  config.clreactssr = {
    index: {
      path: path.join(app.baseDir, 'template/index.html'),
      inject: {
        publicPath: './assets/',
        css: [],
        js: [ 'manifest.js', 'vendor.js', 'index.js' ],
        locals: '_INIT_STORE_',
      },
    },
  };

  return config;
};
