'use strict';

module.exports = app => {
  app.router.post('/manager/create', app.controller.live.gift.create); // 登录接口
};
