'use strict';

// app/controller/user.js
const { v4: unique } = require('uuid');
const Controller = require('egg').Controller;

class UserController extends Controller {
  /**
   * 普通用户注册
   */
  async userRegister() {
    const { ctx, app } = this;

    // 判断接口中是否有用户名、密码
    ctx.validate({
      email: { type: 'string', required: true, desc: '邮箱' },
      password: { type: 'string', required: true, desc: '密码' },
      uuid: { type: 'string', required: false, desc: 'uuid' },
      code: { type: 'string', required: true, desc: '验证码' },
    });

    // 邮箱正则
    const emailValidate = new RegExp('^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$', '');
    const userName = `用户_${unique()}`.slice(0, 30);
    const eMail = ctx.request.body.email;
    const { password, code } = ctx.request.body;
    const uuid = `code_${ctx.request.body.uuid}`;
    const redisUuid = await ctx.service.redis.get(uuid);

    // 判断uuid是否存在或验证码不匹配
    if (!redisUuid || String(redisUuid).toUpperCase() !== String(code).toUpperCase()) {
      ctx.apiFail('验证码错误', 400);
      return;
    }

    // 验证邮箱是否合法
    if (!emailValidate.test(eMail)) {
      ctx.apiFail('请输入正确的邮箱', 400);
      return;
    }

    // 判断user表中是否有重名邮箱
    if (await this.app.model.User.findOne({ where: { eMail } })) {
      ctx.apiFail('邮箱已被占用, 请重新输入', 400);
      return;
    }

    // 注册
    try {
      const { username, id, email, coin, avatar_url, sex, level } = await app.model.User.create({ username: userName, password, email: eMail });
      const token = ctx.getToken(id);

      const data = {
        token,
        data: {
          username,
          email,
          coin,
          avatar_url,
          sex,
          level,
        },
      };
      // const token = ctx.getToken();
      ctx.apiSuccess('注册成功', data, 200);

    } catch (err) {
      ctx.apiFail(err.original.code || '注册失败', 500);
    }

  }

  /**
   * 管理员注册（只有超管能够创建管理员）
   */
  async adminRegister() {
    const { ctx, app } = this;

    // 判断接口中是否有用户名、密码
    ctx.validate({
      email: { type: 'string', required: true, desc: '邮箱' },
      password: { type: 'string', required: true, desc: '密码' },
      uuid: { type: 'string', required: false, desc: 'uuid' },
      code: { type: 'string', required: true, desc: '验证码' },
    });

    // 判断是否为管理员
    const token = ctx.header.authorization;
    const data = ctx.verifyToken(token);
    const user = await app.model.User.findByPk(data.id);

    if (!(user && user.level === '0')) {
      ctx.apiFail('暂无权限操作', 403);
      return;
    }

    // 邮箱正则
    const emailValidate = new RegExp('^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$', '');
    const userName = `管理员_${unique()}`.slice(0, 30);
    const eMail = ctx.request.body.email;
    const { password, code } = ctx.request.body;
    const uuid = `code_${ctx.request.body.uuid}`;
    const redisUuid = await ctx.service.redis.get(uuid);

    // 判断uuid是否存在或验证码不匹配
    if (!redisUuid || String(redisUuid).toUpperCase() !== String(code).toUpperCase()) {
      ctx.apiFail('验证码错误', 400);
      return;
    }

    // 验证邮箱是否合法
    if (!emailValidate.test(eMail)) {
      ctx.apiFail('请输入正确的邮箱', 400);
      return;
    }

    // 判断user表中是否有重名邮箱
    if (await this.app.model.User.findOne({ where: { eMail } })) {
      ctx.apiFail('邮箱已被占用, 请重新输入', 400);
      return;
    }

    // 注册
    try {
      const { username, id, email, coin, avatar_url, sex, level } = await app.model.User.create({ username: userName, password, email: eMail, level: '1' });
      const token = ctx.getToken(id);

      const data = {
        token,
        data: {
          username,
          email,
          coin,
          avatar_url,
          sex,
          level,
        },
      };
      // const token = ctx.getToken();
      ctx.apiSuccess('注册成功', data, 200);

    } catch (err) {
      ctx.apiFail(err.original.code || '注册失败', 500);
    }
  }

}

module.exports = UserController;
