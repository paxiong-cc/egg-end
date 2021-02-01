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
  async edit() {
    const { ctx, app } = this;
    // 判断是否合理
    ctx.validate({
      id: { type: 'int', required: true, desc: '订单id' },
      status: { type: 'int', range: { in: [ 1, 2 ] }, desc: '订单状态' }, // 1-成功 2-关闭
    });

    const { id, status } = ctx.params;
    const orderInfo = await app.model.CoinOrder.findOne({
      where: {
        id,
      },
      include: [
        { model: app.model.CoinList, attributes: [ 'coin' ] },
        { model: app.model.User, attributes: [ 'coin' ] },
      ],
    });

    // 查看订单是否存在
    if (!orderInfo) {
      ctx.apiSuccessNoData('订单不存在');
      return;
    }

    // 如果订单状态不为pending那么状态不能再次被修改
    if (orderInfo.status !== 'pending') {
      ctx.apiSuccessNoData('无法再次修改订单状态');
      return;
    }

    // 将订单状态改为成功并在对应的用户添加金币
    if (status === 1) {
      const transaction = app.model.transaction();

      try {
        // 修改订单状态
        await ctx.model.CoinOrder.update({
          status: 'success',
        }, {
          where: {
            id: orderInfo.id,
          },
        }, { transaction });

        // 将订单对应的金币添加到用户身上
        const totalCoin = orderInfo.coin_list.coin + orderInfo.user.coin;
        const userId = orderInfo.user_id;

        await ctx.model.User.update({
          coin: totalCoin,
        }, {
          where: {
            id: userId,
          },
        }, { transaction });

        // 提交事务
        (await transaction).commit();
        ctx.apiSuccessNoData('订单状态修改为支付成功');

      } catch (err) {
        (await transaction).rollback();
        ctx.apiFail(err.original.code || '修改订单状态失败', 500);
      }
    }

    // 将订单状态修改为取消
    if (status === 2) {
      try {
        orderInfo.update({ status: 'fail' });
        ctx.apiSuccessNoData('订单状态修改为取消支付');
      } catch (err) {
        ctx.apiFail(err.original.code || '修改订单状态失败', 500);
      }
    }
  }

  /**
   * 查询订单列表
   */
  async qeuryList() {
    const { ctx, app } = this;

    // 判断是否合理
    ctx.validate({
      page: { type: 'int', required: true, desc: '页码' },
      size: { type: 'int', required: true, max: 100, desc: '条数' }, // 1-成功 2-关闭
      status: { type: 'string', required: false, range: { in: [ 'pending', 'success', 'fail' ] }, desc: '状态' },
      userId: { type: 'int', required: false, desc: '用户id' },
      orderByStatus: { type: 'string', required: false, range: { in: [ 'pending', 'success', 'fail' ] }, desc: '状态排序' },
      orderByTime: { type: 'string', required: false, range: { in: [ 'pending', 'success', 'fail' ] }, desc: '状态排序' },
    });
    // TODO: 排序
    const { page, size, status, userId } = ctx.query;
    const options = { status, user_id: userId };

    // 处理参数为空的时候
    for (const key in options) {
      options[key]
        ? ''
        : Reflect.deleteProperty(options, key);
    }

    const orderList = await app.model.CoinOrder.findAndCountAll({
      where: options,
      offset: (page - 1) * size,
      limit: size,
      include: [
        { model: app.model.CoinList, attributes: [ 'coin', 'cost' ] },
        { model: app.model.User, attributes: [ 'username' ] },
      ],
      order: [
        [ 'created_at', 'DESC' ],
        [ 'updated_at', 'DESC' ],
      ],
    });

    // 组装数据
    const backData = Object.create(null);

    backData.list = orderList.rows.map(item => {
      const {
        id,
        no,
        status,
        coin_list: { coin, cost },
        user: { username },
        created_at,
        updated_at,
      } = item;
      return { id, no, coin, cost, status, username, created_at, updated_at };
    });

    backData.total = orderList.count;

    ctx.apiSuccess('操作成功', backData);
  }
}

module.exports = CoinOrderController;
