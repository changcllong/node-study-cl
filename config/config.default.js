'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1528897098728_519';

  // add your config here
  config.middleware = [];

  config.security = {
    csrf: {
      useSession: true, // 默认为 false，当设置为 true 时，将会把 csrf token 保存到 Session 中
      cookieName: 'csrfToken', // Cookie 中的字段名，默认为 csrfToken
      sessionName: 'csrfToken', // Session 中的字段名，默认为 csrfToken
    },
  };

  // config.view = {
  //   mapping: {
  //     '.ejs': 'ejs',
  //   },
  // };

  return config;
};
