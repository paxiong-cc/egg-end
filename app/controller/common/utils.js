'use strict';

const Controller = require('egg').Controller;

class UtilsController extends Controller {
  /**
   * 登录
   */
  async login() {
    const { ctx, app } = this;

    // 判断接口中是否有用户名、密码
    ctx.validate({
      email: { type: 'string', required: true, desc: '邮箱' },
      password: { type: 'string', required: true, desc: '密码' },
      uuid: { type: 'string', required: false, desc: 'uuid' },
      code: { type: 'string', required: true, desc: '验证码' },
    });

    const { password, code, email } = ctx.request.body;
    const uuid = `code_${ctx.request.body.uuid}`;
    const redisUuid = await ctx.service.redis.get(uuid);

    // 判断uuid是否存在或验证码不匹配
    if (!redisUuid || String(redisUuid).toUpperCase() !== String(code).toUpperCase()) {
      ctx.apiFail('验证码错误', 400);
      return;
    }

    // TODOS: 登录接口

    // 查询邮箱是否存在
    const userInfo = app.model.User.findOne({
      where: {
        email,
        password,
      },
      attributes: [

      ],
    });

    // 判断用户是否存在
    if (!userInfo) {
      ctx.apiFail('用户不存在或密码错误', 400);
      return;
    }

    // 返回对应的token
    const token = ctx.getToken(userInfo.id);
  }
}

module.exports = UtilsController;
