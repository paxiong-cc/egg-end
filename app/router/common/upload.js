'use strict';

module.exports = app => {
  app.router.post('/upload', app.controller.common.upload.upload); // 上传文件
};
