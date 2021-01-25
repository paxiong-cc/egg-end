'use strict';

module.exports = app => {
  app.router.post('/common/user/register', app.controller.common.user.userRegister); // 普通用户注册接口
  app.router.post('/admin/register', app.controller.common.user.adminRegister); // 管理员注册接口
};
