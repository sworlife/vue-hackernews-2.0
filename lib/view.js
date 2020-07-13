
'use strict';

class View {
  constructor(ctx) {
    this.app = ctx.app;
  }

  render(name, context) {
    return this.app.vue.renderBundle(name, context);
  }

  renderString(tpl, locals) {
    return this.app.vue.renderString(tpl, locals);
  }
}

module.exports = View;
