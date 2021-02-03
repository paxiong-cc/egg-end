'use strict';

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
 * @controller upload 图片上传
 */
class UploadController extends Controller {
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

module.exports = UploadController;
