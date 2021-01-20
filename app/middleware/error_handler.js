'use strict';

module.exports = (option, app) => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
      // 404 处理
      if (ctx.status === 404 && !ctx.body) {
        ctx.body = {
          code: '404',
          msg: '404 错误',
        };
      }
    } catch (err) {
      console.log(err);
      // 记录一条错误日志
      app.emit('error', err, ctx);

      let status = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      let error = status === 500 && app.config.env === 'prod'
        ? 'Internal Server Error'
        : err.msg;

      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = {
        msg: error,
        code: status,
      };

      // 参数验证异常
      if (status === 422 && err.message === 'Validation Failed') {
        if (err.errors && Array.isArray(err.errors)) {
          error = err.errors[0].err[0] ? err.errors[0].err[0] : err.errors[0].err[1];
        }

        status = 400;

        ctx.body = {
          msg: error,
          code: 400,
        };
      }

      ctx.status = status;
    }
  };
};
