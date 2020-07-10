'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const context = {
      title: 'Vu2e HN 2.11',
      meta: `
        <meta name="keywords" content="西南钢铁指数">
      `,
    };
    await ctx.render('aa.js', context);
  }
}

module.exports = HomeController;
