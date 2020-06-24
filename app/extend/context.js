// app/extend/context.js

module.exports = {
  createRender() {
    const { env } = this.app.config
    if (env === 'local') {
      return this.app.createServerRenderer()
    } else {
      return this.app.createClientRenderer()
    }
  },
};