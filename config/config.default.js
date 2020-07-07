/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1592961707642_6380';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    static: {
      prefix: '/public/',
      dir: [
        path.join(appInfo.baseDir, 'app/web/dist'),
        path.join(appInfo.baseDir, 'app/web/public'),
      ], // 多静态文件入口
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
