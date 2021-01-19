'use strict';

module.exports = app => {
  app.router.get('/getCaptcha', app.controller.common.code.getSvgCaptcha); // 获取验证码
};
