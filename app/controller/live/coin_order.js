'use strict';

const Controller = require('egg').Controller;
const { v4: unique } = require('uuid');

/**
 * @controller live 金币订单
 */
class CoinOrderController extends Controller {
  /**
   * @summary 创建购买金币订单
   * @router post /live/createOrder
   * @token ecurityDefinitions验证
   * @request body createCoinOrder *body
   */
  async create() {
    const { ctx, app } = this;

    // 判断是否合理
    ctx.validate({
      coinId: { type: 'number', required: true, desc: '金币选项' },
    });

    const coin_list_id = ctx.request.body.coinId;
    const user_id = Number(ctx.verifyToken(ctx.header.authorization).id);

    // 如果coin_id不在充值金币列表里
    if (!(await app.model.Live.CoinList.findByPk(coin_list_id))) {
      ctx.apiFail('当前金币选项不存在');
      return;
    }

    // 创建订单
    try {
      const no = unique();
      const data = await app.model.Live.CoinOrder.create({ no, coin_list_id, user_id });
      ctx.apiSuccess('创建金币订单成功', data.no);
    } catch (err) {
      ctx.apiFail(err.original.code || '创建金币订单失败', 500);
    }
  }

  /**
   * @summary 修改订单状态（管理员才能操作）
   * @router patch /manager/live/editOrder/{id}/{status}
   * @token ecurityDefinitions验证
   * @request path number *id
   * @request path number *status
   */
  async edit() {
    const { ctx, app } = this;
    // 判断是否合理
    ctx.validate({
      id: { type: 'int', required: true, desc: '订单id' },
      status: { type: 'int', range: { in: [ 1, 2 ] }, desc: '订单状态' }, // 1-成功 2-关闭
    });

    const { id, status } = ctx.params;
    const orderInfo = await app.model.Live.CoinOrder.findOne({
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
        await ctx.model.Live.CoinOrder.update({
          status: 'success',
        }, {
          where: {
            id: orderInfo.id,
          },
        }, { transaction });

        // 将订单对应的金币添加到用户身上
        const totalCoin = orderInfo.coin_list.coin + orderInfo.user.coin;
        const userId = orderInfo.user_id;

        await ctx.model.Common.User.update({
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
   * @summary 查询订单列表
   * @router get /live/order
   * @token ecurityDefinitions验证
   * @request query number *page
   * @request query number *size
   * @request query string status
   * @request query number userId
   * @request query string orderByTime
   * @request query string startTime
   * @request query string endTime
   * @request query string keyword
   */
  async qeuryList() {
    const { ctx, app } = this;
    const Op = app.model.Sequelize.Op;

    // 判断是否合理
    ctx.validate({
      page: { type: 'int', required: true, desc: '页码' },
      size: { type: 'int', required: true, max: 100, desc: '条数' }, // 1-成功 2-关闭
      status: { type: 'string', required: false, range: { in: [ 'pending', 'success', 'fail' ] }, desc: '状态' },
      userId: { type: 'int', required: false, desc: '用户id' },
      orderByTime: { type: 'string', required: false, range: { in: [ 'ASC', 'DESC' ] }, desc: '状态排序' },
      startTime: { type: 'date', required: false, desc: '开始时间' },
      endTime: { type: 'date', required: false, desc: '结束时间' },
      keyword: { type: 'string', required: false, desc: '人员名称' },
    });

    const { page, size, status, userId, orderByTime, startTime, endTime, keyword } = ctx.query;
    const wOptions = { status, user_id: userId };
    const oOptions = [
      [ 'created_at', orderByTime || 'DESC' ],
    ];

    // 处理参数为空的时候
    for (const key in wOptions) {
      wOptions[key]
        ? ''
        : Reflect.deleteProperty(wOptions, key);
    }

    // 判断开始时间存在时打入时间赛选条件
    if (startTime) {
      const end = endTime || new Date();

      wOptions.created_at = {
        [Op.gte]: startTime,
        [Op.lte]: end,
      };
    }

    // 判断人员名称关键字是否存在
    if (keyword) {
      wOptions['$user.username$'] = {
        [Op.like]: `%${keyword}%`,
      };
    }

    const orderList = await app.model.Live.CoinOrder.findAndCountAll({
      attributes: [
        'id',
        'no',
        [ app.model.Sequelize.col('coin_list.coin'), 'coin' ],
        [ app.model.Sequelize.col('coin_list.cost'), 'cost' ],
        'status',
        [ app.model.Sequelize.col('user.username'), 'username' ],
        'created_at',
        'updated_at',
      ],
      where: wOptions,
      offset: (page - 1) * size,
      limit: size,
      include: [
        { model: app.model.CoinList, as: 'coin_list', attributes: [] }, // as的值作为查询出来的新集合的键
        { model: app.model.User, as: 'user', attributes: [] }, // as的值作为查询出来的新集合的键
      ],
      order: oOptions,
    });

    // 修改字段名
    const newOrderList = Object.create(null);
    newOrderList.total = orderList.count;
    newOrderList.list = orderList.rows;

    ctx.apiSuccess('操作成功', newOrderList);
  }
}

module.exports = CoinOrderController;
