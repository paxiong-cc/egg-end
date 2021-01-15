'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  // 用户相关的接口
  require('./router/admin/user')(app);
  router.get('/', controller.home.index);
};
