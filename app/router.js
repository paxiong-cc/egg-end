'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  /**
   * 公共模块
   */
  require('./router/common/utils')(app); // 登录 上传 验证码
  require('./router/common/user')(app); // 用户相关的接口

  /**
   * 直播模块
   */
  require('./router/live/gift')(app); // 礼物
  require('./router/live/coin_order')(app); // 订单
  require('./router/live/coin_list')(app); // 充值金额列表
};
