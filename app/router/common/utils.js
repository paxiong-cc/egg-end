'use strict';

module.exports = app => {
  app.router.post('/common/login', app.controller.common.utils.login); // 登录接口
};
