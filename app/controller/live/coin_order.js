'use strict';

const Controller = require('egg').Controller;
const { v4: unique } = require('uuid');

// 金币订单
class CoinOrderController extends Controller {
  /**
   * 创建购买金币订单
   */
  async create() {
    const { ctx, app } = this;

    // 判断是否合理
    ctx.validate({
      coinId: { type: 'number', required: true, desc: '金币选项' },
    });

    const coin_id = ctx.query.coinId;
    const user_id = Number(ctx.verifyToken(ctx.header.authorization).id);

    // 如果coin_id不在充值金币列表里
    if (!(await app.model.CoinList.findByPk(coin_id))) {
      ctx.apiFail('当前金币选项不存在');
      return;
    }

    // 创建订单
    try {
      const no = unique();
      const data = await app.model.CoinOrder.create({ no, coin_id, user_id });
      ctx.apiSuccess('创建金币订单成功', {
        no: data.no,
      });
    } catch (err) {
      ctx.apiFail(err.original.code || '创建金币订单失败', 500);
    }
  }

  /**
   * 修改订单状态（管理员才能操作）
   */
  edit() {
    const { ctx, app } = this;
    // 判断是否合理
    ctx.validate({
      id: { type: 'number', required: true, desc: '订单id' },
      status: { type: 'enum', values: [ '1', '2' ], desc: '订单状态' },
    });

  }
}

module.exports = CoinOrderController;
