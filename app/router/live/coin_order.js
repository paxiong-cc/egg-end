'use strict';

module.exports = app => {
  app.router.post('/live/createOrder', app.controller.live.coinOrder.create); // 创建金币订单列表
  app.router.patch('/manager/live/editOrder/:id/:status', app.controller.live.coinOrder.edit); // 更新订单列表状态
  app.router.get('/live/order', app.controller.live.coinOrder.qeuryList); // 查询订单列表
};
