'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const context = {
      title: 'Vue HN 2.0', // default title
      url: ctx.request.url,
    };
    ctx.render(context).then(html => {
      console.log(html, 'home.js html', ctx.request.url);
      ctx.body = html;
    }, err => {
      console.log(err, 'home.js err');
    });
  }
}

module.exports = HomeController;
