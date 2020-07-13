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
      prefix: '/dist/',
      // dirs: [
      //   { prefix: '/public/', dir: path.join(appInfo.baseDir, 'app/public') },
      //   { prefix: '/manifest.json', dir: path.join(appInfo.baseDir, 'manifest.json') },
      //   { prefix: '/service-worker.js', dir: path.join(appInfo.baseDir, 'app/dist/service-worker.js') },
      // ], // 多静态文件入口
      dir: path.join(appInfo.baseDir, 'dist'),
    },
    vue: {
      cache: true,
      // renderOptions: {
      //   template: `<!DOCTYPE html><html lang="en"><body><!--vue-ssr-outlet--></body></html>`,
      //   ......
      // },
    },
    view: {
      defaultViewEngine: 'vue',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
