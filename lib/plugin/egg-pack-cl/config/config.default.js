'use strict';

const nodeExternals = require('webpack-node-externals');

module.exports = () => {
  const config = {};

  config.clpack = {
    path: './app/public',
    publicPath: '/assets/',

    entry: {
      index: [ './app/web/client.js' ],
    },

    html: {
      index: {
        template: 'template/index.html',
      },
    },

    runtimeChunk: {
      name: 'manifest',
    },

    commonChunks: {
      vendor: [ 'node_modules' ],
    },

    ssr: {
      path: './app/view/pages',
      entry: {
        server: [ './app/web/server.js' ],
      },
      filename: '[name].js',
      target: 'node',
      externals: [ nodeExternals({ modulesDir: 'node_modules' }) ],
      html: false,
      minimizer: false,
    },
  };

  return config;
};
