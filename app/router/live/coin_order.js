'use strict';

module.exports = app => {
  app.router.post('/live/createOrder', app.controller.live.coinOrder.create); // 创建金币订单列表
  app.router.patch('/manager/live/editOrder/:id/:status', app.controller.live.coinOrder.edit); // 更新订单列表状态
};
