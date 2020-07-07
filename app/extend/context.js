'use strict';

module.exports = {
  createRender() {
    const { env } = this.app.config;

    if (env === 'production') {
      return this.app.createServerRenderer();
    }
    return this.app.createClientRenderer();
  },
};
