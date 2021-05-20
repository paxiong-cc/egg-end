'use strict';

// app/controller/user.js
const Controller = require('egg').Controller;

class NpmController extends Controller {
  async qeuryList() {
    const { ctx, app } = this;
    const orderList = await app.model.Common.Npm.findAndCountAll()
    ctx.apiSuccess('操作成功', orderList);
  }
}

module.exports = NpmController;
