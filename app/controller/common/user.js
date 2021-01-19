'use strict';

// app/controller/user.js
const { v4: unique } = require('uuid');
const Controller = require('egg').Controller;

class UserController extends Controller {
  // 普通用户注册接口
  async userRegister() {
    const { ctx } = this;

    // 判断接口中是否有用户名、密码
    ctx.validate({
      email: { type: 'string', required: true, desc: '邮箱' },
      password: { type: 'string', required: true, desc: '密码' },
      uuid: { type: 'string', required: false, desc: 'uuid' },
      code: { type: 'string', required: true, desc: '验证码' },
    });

    // 邮箱正则
    const emailValidate = new RegExp('^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$', '');
    const username = `用户_${unique()}`.slice(30);
    const { email, password, code } = ctx.request.body;
    const uuid = `code_${ctx.request.body.uuid}`;
    const redisUuid = await ctx.service.redis.get(uuid);

    // 判断uuid是否存在或验证码不匹配
    if (!redisUuid || String(redisUuid).toUpperCase() !== String(code).toUpperCase()) {
      ctx.apiFail('验证码错误', 400);
      return;
    }

    // 验证邮箱是否合法
    if (!emailValidate.test(email)) {
      ctx.apiFail('请输入正确的邮箱', 400);
      return;
    }

    // 判断user表中是否有重名邮箱
    if (await this.app.model.User.findOne({ where: { email } })) {
      ctx.apiFail('邮箱已被占用, 请重新输入', 400);
      return;
    }

    // 注册
    try {
      await this.app.model.User.create({ username, password, email });
      ctx.apiSuccess('注册成功', '', 200);

    } catch (err) {
      console.log(err);
      ctx.apiFail(err.original.code || '注册失败', 500);
    }

  }

  // 管理员注册接口
  async adminRegister() {
    const { ctx } = this;
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;

    // 判断是否是管理员

    // 判断接口中是否有用户名、密码
    ctx.validate({
      username: { type: 'string', required: true, desc: '用户名' },
      password: { type: 'string', required: true, desc: '密码' },
    });


    // 判断user表中是否有重名用户
    if (await this.app.model.User.findOne({ where: { username } })) {
      ctx.apiFail('用户重名, 请重新输入', 406);
      return;
    }

    // 注册
    try {
      await this.app.model.User.create({ username, password });

      ctx.apiSuccess('注册成功', '', 200);

    } catch (err) {
      ctx.apiSuccess('注册失败', '', 500);
    }

  }
}

module.exports = UserController;
