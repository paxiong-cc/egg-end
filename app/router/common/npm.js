'use strict';

module.exports = app => {
  app.router.get('/common/npm/list', app.controller.common.npm.qeuryList); // 获取版本号列表
};
