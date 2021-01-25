'use strict';

module.exports = (option, app) => {
  return async function auth(ctx, next) {
    // 验证是否是管理员
    const id = ctx.verifyToken(ctx.request.header.authorization).id;
    const userInfo = await app.model.User.findByPk(Number(id));

    // 0-超管 1-管理员 2-普通用户
    if (Number(userInfo.level) >= 2) {
      throw ({
        status: 403,
        message: '暂无操作权限',
      });
    }

    await next();
  };
};
