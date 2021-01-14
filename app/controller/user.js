'use strict';

// app/controller/user.js
const Controller = require('egg').Controller;

class UserController extends Controller {
  // 注册接口
  async register() {
    const { ctx } = this;
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;

    // 判断接口中是否有用户名、密码
    if (!(username && password)) {
      ctx.body = {
        code: 'Error',
        msg: '请传入正确的参数',
      };
      return;
    }

    // 判断user表中是否有重名用户
    if (await this.app.model.User.findOne({ where: { username } })) {
      ctx.body = {
        code: 'Error',
        msg: '当前用户已存在',
      };
      return;
    }

    // 注册
    try {
      await this.app.model.User.create({ username, password });

      ctx.body = {
        code: 200,
        msg: '注册成功',
      };

    } catch (err) {
      ctx.body = {
        code: 'Error',
        msg: '注册失败',
      };
    }

  }
}

module.exports = UserController;
