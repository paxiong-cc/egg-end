'use strict';
const svgCaptcha = require('svg-captcha');
// 引入
const fs = require('fs');
const path = require('path');
// 故名思意 异步二进制 写入流
const awaitWriteStream = require('await-stream-ready').write;
// 管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole');
const dayjs = require('dayjs');

const Controller = require('egg').Controller;

/**
 * @controller utils 打杂的
 */
class UtilsController extends Controller {
  /**
   * @summary 登录
   * @router post /common/login
   * @request body login *body
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

    // 查询邮箱是否存在
    const userInfo = await app.model.User.findOne({
      where: {
        email,
        password,
      },
      attributes: {
        exclude: [ 'password', 'delete', 'deletedAt', 'deleted_at' ],
      },
    });

    // 判断用户是否存在
    if (!userInfo) {
      ctx.apiFail('用户不存在或密码错误', 400);
      return;
    }

    // 返回对应的token
    const token = ctx.getToken(userInfo.id);

    ctx.apiSuccess('登录成功', {
      token,
      data: userInfo,
    });
  }


  /**
   * @summary 获取图形验证码
   * @router get /common/getCaptcha
   * @request query string uuid
   */
  async getSvgCaptcha() {
    const { ctx, app } = this;

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
      await ctx.service.redis.set(`code_${uuid}`, newCaptca.text, app.config.custom.codeExp);
      // 返回
      ctx.apiSuccess('获取验证码成功', newCaptca.data);
    } catch (err) {
      throw ({
        message: '获取验证码失败',
        status: 500,
      });
    }
  }

  /**
   * @summary 上传图片
   * @description 上传文件
   * @router post /upload
   * @token ecurityDefinitions验证
   * @request formData file *file
   */
  async upload() {
    const stream = await this.ctx.getFileStream();

    // 如果文件过大
    if (stream.readableLength > this.ctx.app.config.custom.fileMax) {
      throw ({
        status: 400,
        message: '文件过大',
      });
    }
    // 基础的目录
    const uploadBasePath = 'app/public/uploads';
    // 生成文件名
    const filename = `${Date.now()}${Number.parseInt(
      Math.random() * 1000
    )}${path.extname(stream.filename).toLocaleLowerCase()}`;
    // 生成文件夹
    const dirname = dayjs(Date.now()).format('YYYY/MM/DD');
    function mkdirsSync(dirname) {
      if (fs.existsSync(dirname)) {
        return true;
      }
      if (mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
    mkdirsSync(path.join(uploadBasePath, dirname));
    // 生成写入路径
    const target = path.join(uploadBasePath, dirname, filename);
    // 写入流
    const writeStream = fs.createWriteStream(target);
    try {
      // 异步把文件流 写入
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {
      // 如果出现错误，关闭管道
      await sendToWormhole(stream);
      this.ctx.throw({
        status: 500,
        message: err,
      });
    }
    const url = path.join('/public/uploads', dirname, filename).replace(/\\|\//g, '/');
    this.ctx.apiSuccess('上传成功', url);
  }
}

module.exports = UtilsController;
