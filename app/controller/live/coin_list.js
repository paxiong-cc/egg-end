'use strict';

const Controller = require('egg').Controller;


/**
 * @controller live 金币充值列表
 */
class CoinListController extends Controller {
  /**
   * @summary 创建充值金额列表数据
   * @router post /manager/createCoinLis
   * @token ecurityDefinitions验证
   * @request body createCoinlist *body
   */
  async create() {
    const { ctx, app } = this;

    // 判断是否合理
    ctx.validate({
      coin: { type: 'number', required: true, range: { min: 1, max: 10 ** 19 }, desc: '金币面额' },
      cost: { type: 'number', required: true, range: { min: 1, max: 10 ** 19 }, desc: '消费面额' },
    });

    const { coin, cost } = ctx.request.body;

    // 如果列表里有相同金币面板则创建失败
    if (await app.model.Live.CoinList.findOne({ where: { coin } })) {
      ctx.apiFail('已存在列表金额, 请勿重复添加');
      return;
    }

    // 创建
    try {
      await app.model.Live.CoinList.create({ coin, cost });
      ctx.apiSuccessNoData('创建充值金额列表成功');
    } catch (err) {
      ctx.apiFail(err.original.code || '创建充值金额列表失败', 500);
    }
  }
}

module.exports = CoinListController;
