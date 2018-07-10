'use strict';

// const path = require('path');
const Controller = require('egg').Controller;
const fs = require('fs');

class HomeController extends Controller {
  async index() {
    this.ctx.session.uid = 'changcllong';
    await this.ctx.render('pages/server.js', { list: [ 0, 1, 2, 3 ] }, { url: this.ctx.url });
  }

  async stream() {
    this.ctx.type = 'text/plain; charset=utf-8';
    this.ctx.body = fs.createReadStream('./app/public/text.txt', { encoding: 'utf8' });
  }
}

module.exports = HomeController;
