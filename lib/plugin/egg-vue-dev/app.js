'use strict';
const path = require('path');
const fs = require('fs');
const os = require('os');
const open = require('opn');
const convert = require('koa-convert');
const proxy = require('./lib/proxy');
const Constant = require('./lib/constant');
const webpackServer = require('./lib/server');

function getIp(position) {
  const interfaces = os.networkInterfaces();
  const ips = [];

  if (interfaces.en0) {
    for (let i = 0; i < interfaces.en0.length; i++) {
      if (interfaces.en0[i].family === 'IPv4') {
        ips.push(interfaces.en0[i].address);
      }
    }
  }
  if (interfaces.en1) {
    for (let i = 0; i < interfaces.en1.length; i++) {
      if (interfaces.en1[i].family === 'IPv4') {
        ips.push(interfaces.en1[i].address);
      }
    }
  }
  if (position > 0 && position <= ips.length) {
    return ips[position - 1];
  } else if (ips.length) {
    return ips[0];
  }
  return '127.0.0.1';
}

module.exports = app => {
  app.use(function* (next) {
    console.log('app.WEBPACK_BUILD_READY', app.WEBPACK_BUILD_READY);
    if (app.WEBPACK_BUILD_READY) {
      yield* next;
    } else {
      if (app.WEBPACK_LOADING_TEXT) {
        this.body = app.WEBPACK_LOADING_TEXT;
      } else {
        const filePath = path.resolve(__dirname, './lib/template/loading.html');
        this.body = app.WEBPACK_LOADING_TEXT = fs.readFileSync(filePath, 'utf8');
      }
    }
  });

  app.messenger.setMaxListeners(app.config.webpack.maxListeners || 10000);

  app.messenger.on(Constant.EVENT_WEBPACK_BUILD_STATE, data => {
    console.log('app: Constant.EVENT_WEBPACK_BUILD_STATE', Constant.EVENT_WEBPACK_BUILD_STATE, data);

    app.renderer = webpackServer.serverRenderer;

    app.WEBPACK_BUILD_READY = data.state;
    const config = app.config.webpack;
    const port = config.port;
    if (!app.WEBPACK_BUILD_PROXY && config.proxy) {
      app.WEBPACK_BUILD_PROXY = true;
      if (typeof config.proxy === 'boolean') {
        config.proxy = {
          host: `http://127.0.0.1:${port}`,
          match: /^\/public\//,
        };
      } else if (config.proxy.force !== true) {
        config.proxy.host = `http://127.0.0.1:${port}`;
      }
      app.middleware.splice(app.middleware.length - 2, 0, convert(proxy(config.proxy)));
    }
  });

  app.messenger.on(Constant.EVENT_WEBPACK_OPEN_BROWSER, () => {
    console.log('app: Constant.EVENT_WEBPACK_OPEN_BROWSER', Constant.EVENT_WEBPACK_OPEN_BROWSER);

    const port = app.options.port;
    const url = app.config.webpack.browser;
    let browserUrl;
    if (/^(https?:|\/\/)/.test(url)) {
      browserUrl = url;
    } else {
      const ip = getIp();
      const host = `http://${ip}:${port}`;
      if (url) {
        browserUrl = `${host}/${url}`;
      } else {
        browserUrl = host;
      }
    }
    open(browserUrl);
  });

  app.ready(() => {
    console.log('app:app.ready');
    app.messenger.sendToAgent(Constant.EVENT_WEBPACK_BUILD_STATE);
  });
};
