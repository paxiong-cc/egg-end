'use strict';

// app/controller/user.js
const { v4: unique } = require('uuid');
const Controller = require('egg').Controller;

/**
 * @controller user 用户接口
 */
class UserController extends Controller {
  /**
   * @summary 普通用户注册
   * @description 创建用户，记录用户账户/密码/类型
   * @router post /common/user/register
   * @request body createUser *body
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
    const username = `用户_${unique()}`.slice(0, 30);
    const email = ctx.request.body.email;
    const { password, code } = ctx.request.body;
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
      const userInfo = JSON.parse(JSON.stringify(await app.model.Common.User.create({ username, password, email })));
      const token = ctx.getToken(userInfo.id);

      delete userInfo.deletedAt;
      delete userInfo.deleted_at;
      delete userInfo.password;

      const data = {
        token,
        data: userInfo,
      };
      // const token = ctx.getToken();
      ctx.apiSuccess('注册成功', data, 200);

    } catch (err) {
      ctx.apiFail(err.original.code || '注册失败', 500);
    }

  }

  /**
   * @summary 管理员注册（只有超管能够创建管理员）
   * @description 创建管理员，记录用户账户/密码/类型
   * @router post /admin/register
   * @token ecurityDefinitions验证
   * @request body createAdmin *body
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
    const user = await app.model.Common.User.findByPk(data.id);

    if (!(user && user.level === '0')) {
      ctx.apiFail('暂无权限操作', 403);
      return;
    }

    // 邮箱正则
    const emailValidate = new RegExp('^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$', '');
    const username = `管理员_${unique()}`.slice(0, 30);
    const email = ctx.request.body.email;
    const { password, code } = ctx.request.body;
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
    if (await this.app.model.Common.User.findOne({ where: { email } })) {
      ctx.apiFail('邮箱已被占用, 请重新输入', 400);
      return;
    }

    // 注册
    try {
      const userInfo = JSON.parse(JSON.stringify(await app.model.Common.User.create({ username, password, email, level: '1' })));
      const token = ctx.getToken(userInfo.id);

      delete userInfo.deletedAt;
      delete userInfo.deleted_at;
      delete userInfo.password;

      const data = {
        token,
        data: userInfo,
      };
      // const token = ctx.getToken();
      ctx.apiSuccess('注册成功', data, 200);

    } catch (err) {
      ctx.apiFail(err.original.code || '注册失败', 500);
    }
  }

}

module.exports = UserController;
