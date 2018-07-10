'use strict';
const CLPack = require('cl-pack');
// const ReactSsrRebuildPlugin = require('./lib/webpackPlugin/react-ssr-rebuild-plugin');

function getWebpackConfig(ssrConfig) {
  return webpackConfig => {
    webpackConfig.output.library = ssrConfig.library || 'server';
    webpackConfig.output.libraryTarget = ssrConfig.libraryTarget || 'umd';

    return webpackConfig;
  };
}

module.exports = agent => {
  agent.messenger.on('egg-ready', () => {
    // const pack = new CLPack(agent.config.clpack);
    // const webpackConfig = {
    //   plugins: [
    //     new ReactSsrRebuildPlugin(agent.config.clpack.ssr),
    //   ],
    // };
    // pack.server(webpackConfig);
    const ssrConfig = agent.config.clpack.ssr;

    if (ssrConfig) {
      const ssrPack = new CLPack(ssrConfig);

      if (agent.config.env === 'local') {
        ssrPack.watch(getWebpackConfig(ssrConfig));
      } else {
        ssrPack.build(getWebpackConfig(ssrConfig));
      }
    }
    new CLPack(agent.config.clpack).server();
  });
};
