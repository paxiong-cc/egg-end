'use strict';

module.exports = () => {
  return async function auth(ctx, next) {
    // 如果接口没有带请求头
    if (!ctx.header.authorization) {
      throw ({
        status: 401,
        message: '身份验证失败',
      });
    }

    // 验证token是否有效
    ctx.verifyToken(ctx.header.authorization);

    await next();
  };
};
