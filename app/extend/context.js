'use strict';

// app/extend/context.js
module.exports = {
  // 成功提示
  apiSuccess(msg = 'ok', data = {}, code = 200) {
    this.body = { msg, data, code };
    this.status = code;
  },

  // 成功提示无data
  apiSuccessNoData(msg = 'ok', code = 200) {
    this.body = { msg, code };
    this.status = code;
  },

  // 失败提示
  apiFail(msg = 'fail', code = 400) {
    this.body = { msg, code };
    this.status = code;
  },

  // 获取token
  getToken(id) {
    const { app } = this;
    const token = app.jwt.sign({ id }, app.config.jwt.secret, {
      expiresIn: app.config.custom.tokenExp, // 时间根据自己定，具体可参考jsonwebtoken插件官方说明
    });
    return token;
  },

  // 验证token
  verifyToken(token) {
    const { app } = this;
    // 验证失败会走动抛出异常
    try {
      const flag = app.jwt.verify(token, app.config.jwt.secret);
      return flag;
    } catch (err) {
      throw ({
        status: 401,
        message: 'token验证失效',
      });
    }
  },
};
