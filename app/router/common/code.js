'use strict';

module.exports = app => {
  app.router.get('/common/getCaptcha', app.controller.common.code.getSvgCaptcha); // 获取验证码
};
