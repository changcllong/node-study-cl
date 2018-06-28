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
    layout: {
      main: path.join(app.baseDir, 'app/view/layout.js'),
    },
  };

  return config;
};
