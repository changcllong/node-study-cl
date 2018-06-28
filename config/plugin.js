'use strict';

const path = require('path');
// had enabled by egg
// exports.static = true;

exports.clreactssr = {
  enable: true,
  // package: 'egg-view-react',
  path: path.join(__dirname, '../lib/plugin/egg-react-ssr-cl'),
};
