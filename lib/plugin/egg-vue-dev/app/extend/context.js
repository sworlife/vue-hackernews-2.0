'use strict';

const Constant = require('../../lib/constant');

module.exports = {
  render(context) {
    return new Promise((resolve, reject) => {
      this.app.messenger.sendToAgent(Constant.EVENT_WEBPACK_READ_FILE_MEMORY, context);
      this.app.messenger.on(Constant.EVENT_WEBPACK_READ_FILE_MEMORY_CONTENT, data => {
        if (data.err) {
          reject(data.err);
        }
        resolve(data.fileContent);
      });
    });
  },
};
