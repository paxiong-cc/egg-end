'use strict';

const svgCaptcha = require('svg-captcha');

// app/controller/user.js
const Controller = require('egg').Controller;

class UserController extends Controller {

  // 获取图形验证码
  async getSvgCaptcha() {
    const { ctx } = this;

    // 验证uuid是否存在
    ctx.validate({
      uuid: { type: 'string', required: true, desc: '唯一键' },
    });

    const uuid = ctx.query.uuid;

    // 图形验证码
    const newCaptca = svgCaptcha.create({
      size: 4,
      ignoreChars: '0o1il',
      color: true,
      noise: Math.floor(Math.random() * 5),
      width: 150,
      height: 38,
    });


    try {
      // 存入redis
      await ctx.service.redis.set(`code_${uuid}`, newCaptca.text, 5 * 60);
      // 返回
      ctx.apiSuccess('获取验证码成功', newCaptca.data);
    } catch (err) {
      ctx.status = 406;
      throw ('获取验证码失败');
    }
  }
}

module.exports = UserController;
