'use strict';

const Controller = require('egg').Controller;

// 礼物
class GiftController extends Controller {
  async create() {
    const { ctx, app } = this;

    // 判断是否合理
    ctx.validate({
      name: { type: 'string', required: true, desc: '礼物名称' },
      image: { type: 'string', required: false, desc: '礼物图片' },
      coin: { type: 'number', required: true, desc: '礼物金额' },
    });

    const { name, image, coin } = ctx.request.body;

    try {
      await app.model.Gift.create({ name, image, coin });
      ctx.apiSuccessNoData('添加礼物成功');
    } catch (err) {
      ctx.apiFail(err.original.code || '添加礼物失败', 500);
    }
  }
}

module.exports = GiftController;
