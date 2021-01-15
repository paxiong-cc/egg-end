'use strict';

module.exports = app => {
  app.router.post('/user/register', app.controller.user.register); // 注册接口
  app.router.get('/user/bulkCreate', app.controller.user.bulkCreate); // 批量创造用户
};
