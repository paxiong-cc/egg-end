'use strict';

module.exports = app => {
  app.router.put('/upload', app.controller.common.upload.upload); // 上传文件
};
