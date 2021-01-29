'use strict';

module.exports = app => {
  app.router.post('/manager/createCoinList', app.controller.live.coinList.create); // 创建金币充值选项
};
