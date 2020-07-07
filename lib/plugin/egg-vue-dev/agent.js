'use strict';

const webpackServer = require('./lib/server');
const Constant = require('./lib/constant');

module.exports = agent => {
  agent.messenger.on('egg-ready', () => {
    console.log('agent:egg-ready: agent服务启动，开始编译前端');

    webpackServer.createCompiler();
    webpackServer.serverCompiler.watch({}, (err, stats) => {
      if (err) throw err;
      stats = stats.toJson();
      if (stats.errors.length) return;

      webpackServer.createRenderer();
      agent.messenger.sendToApp(Constant.EVENT_WEBPACK_BUILD_STATE, { state: true });
    });
    agent.messenger.sendToApp(Constant.EVENT_WEBPACK_OPEN_BROWSER);
    console.log('agent: 前端代码编译完成');
  });

  // 浏览器访问, 监听Egg Worker 发送过来读取内存文件(服务端渲染文件, 前端资源文件)
  agent.messenger.on(Constant.EVENT_WEBPACK_READ_FILE_MEMORY, data => {
    console.log('agent: Constant.EVENT_WEBPACK_READ_FILE_MEMORY', data);
    webpackServer.serverRenderer.renderToString(data, (err, html) => {
      agent.messenger.sendToApp(Constant.EVENT_WEBPACK_READ_FILE_MEMORY_CONTENT, {
        fileContent: html,
        filePath: data.url,
        err,
      });
    });
  });

  // agent.messenger.on(Constant.EVENT_WEBPACK_BUILD_STATE, () => {
  //   console.log('agent: Constant.EVENT_WEBPACK_BUILD_STATE', Constant.EVENT_WEBPACK_BUILD_STATE);

  //   agent.messenger.sendToApp(Constant.EVENT_WEBPACK_BUILD_STATE, { state: true });
  // });
};

process.on('exit', () => {
  process.exit(0);
});
