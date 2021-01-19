'use strict';

// app/extend/context.js
module.exports = {
  // 成功提示
  apiSuccess(msg = 'ok', data = {}, code = 200) {
    this.body = { msg, data, code };
    this.status = code;
  },

  // 失败提示
  apiFail(msg = 'fail', code = 400) {
    this.body = { msg, code };
    this.status = code;
  },
};
