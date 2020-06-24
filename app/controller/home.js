'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.createRender().then(renderer => {
      const context = {
        title: 'Vue HN 2.0', // default title
        url: ctx.request.url,
      };
      console.log(ctx.request.url)
      renderer.renderToString(context, (err, html) => {
        if (err) {
          console.log(err, html);

          ctx.body = html;
          return;
        }
        ctx.body = html;
      });
    });
  }
}

module.exports = HomeController;
