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
    ctx.validate({
      username: { type: 'string', required: true, desc: '用户名' },
      password: { type: 'string', required: true, desc: '密码' },
    });

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

  // 批量创造
  async bulkCreate() {
    const { ctx } = this;
    const user = await ctx.model.User.bulkCreate([{
      username: '第一个',
      age: 15,
    },
    {
      username: '第二个',
      age: 15,
    },
    {
      username: '第三个',
      age: 15,
    }]);
    ctx.status = 201;
    ctx.body = user;
  }
}

module.exports = UserController;
