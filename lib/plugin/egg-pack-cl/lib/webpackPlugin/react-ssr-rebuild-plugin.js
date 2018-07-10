'use strict';

const CLPack = require('cl-pack');

class ReactSsrRebuildPlugin {
  constructor(packConfig) {
    this.packConfig = packConfig;
    this.pack = new CLPack(packConfig);
  }

  apply(compiler) {
    if (compiler.hooks) {
      compiler.hooks.watchRun.tapAsync('ReactSsrRebuildPlugin', (compilationParams, callback) => {

        console.log('ReactSsrRebuildPlugin', '...............building ssr...............!');

        this.pack.build(webpackConfig => {
          webpackConfig.output.library = 'server';
          webpackConfig.output.libraryTarget = 'umd';

          return webpackConfig;
        }, () => {
          console.log('ReactSsrRebuildPlugin', '...............building finish...............!');
          callback();
        });
      });
    }
  }
}

module.exports = ReactSsrRebuildPlugin;
