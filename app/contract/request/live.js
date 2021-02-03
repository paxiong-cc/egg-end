'use strict';

/**
 * 直播模块
 */
module.exports = {
  // 创建充值金额列表数据
  createCoinlist: {
    coin: { type: 'number', required: true, desc: '金币面额' },
    cost: { type: 'number', required: true, desc: '消费面额' },
  },

  // 创建购买金币订单
  createCoinOrder: {
    coinId: { type: 'number', required: true, desc: '金币选项' },
  },

  // 修改订单状态（管理员才能操作）
  createGift: {
    name: { type: 'string', required: true, desc: '礼物名称' },
    image: { type: 'string', required: false, desc: '礼物图片' },
    coin: { type: 'number', required: true, desc: '礼物金额' },
  },
};
