'use strict';

const Controller = require('egg').Controller;

/**
 * @controller live 礼物
 */
class GiftController extends Controller {
  /**
   * @summary 创建购买金币订单
   * @router post /manager/create
   * @token ecurityDefinitions验证
   * @request body createGift *body
   */
  async create() {
    const { ctx, app } = this;

    // 判断是否合理
    ctx.validate({
      name: { type: 'string', required: true, desc: '礼物名称' },
      image: { type: 'string', required: false, desc: '礼物图片' },
      coin: { type: 'number', required: true, desc: '礼物金额' },
    });

    const { name, image, coin } = ctx.request.body;

    // 判断礼物名是否重复
    if (await app.model.Live.Gift.findOne({ where: { name } })) {
      ctx.apiSuccessNoData('礼物名重复');
      return;
    }

    try {
      await app.model.Live.Gift.create({ name, image, coin });
      ctx.apiSuccessNoData('添加礼物成功');
    } catch (err) {
      ctx.apiFail(err.original.code || '添加礼物失败', 500);
    }
  }
}

module.exports = GiftController;
