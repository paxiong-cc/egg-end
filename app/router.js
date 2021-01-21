'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 登录相关
  require('./router/common/utils')(app);
  // 用户相关的接口
  require('./router/common/user')(app);
  // 验证码相关
  require('./router/common/code')(app);
  router.get('/', controller.home.index);
};
