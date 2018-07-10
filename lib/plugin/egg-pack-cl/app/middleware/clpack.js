'use strict';

const http = require('http');
const CLPack = require('cl-pack');

module.exports = options => {
  const packConfig = new CLPack(options).useDev().getPackConfig();

  return async function(ctx, next) {
    const port = packConfig.port || 8080;
    let hotUrl = '/__webpack_hmr';
    if (packConfig.hotClientJS) {
      hotUrl = packConfig.hotClientJS.path || hotUrl;
    }
    if (ctx.url === hotUrl) {
      ctx.unsafeRedirect(`http://${ctx.hostname}:${port}${ctx.url}`);
      return;
    }

    const notInWebpack = await new Promise(resolve => {
      const req = http.request({
        hostname: ctx.hostname,
        port,
        path: ctx.url,
        method: 'GET',
        headers: ctx.headers,
      }, res => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          ctx.res.statusCode = res.statusCode;
          for (const key in res.headers) {
            ctx.res.setHeader(key, res.headers[key]);
          }

          res.pipe(ctx.res).on('finish', resolve);
          return;
        }

        resolve(true);
      });

      req.on('error', () => {
        resolve(true);
      });
      req.end();
    });

    // console.log(ctx.url, notInWebpack);
    if (notInWebpack) { await next(); }
  };
};
