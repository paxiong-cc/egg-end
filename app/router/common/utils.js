'use strict';

module.exports = app => {
  app.router.post('/upload', app.controller.common.utils.upload); // 上传文件
  app.router.get('/common/getCaptcha', app.controller.common.utils.getSvgCaptcha); // 获取验证码
  app.router.post('/common/login', app.controller.common.utils.login); // 登录接口
};
