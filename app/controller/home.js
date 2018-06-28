'use strict';

// const path = require('path');
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.session.uid = 'long.chang';
    await this.ctx.render('index.js', { list: [ 0, 1, 2, 3 ], url: this.ctx.url }, { test: 'cl' });
  }
}

module.exports = HomeController;
