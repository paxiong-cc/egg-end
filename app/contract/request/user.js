'use strict';

/**
 * 直播
 */
module.exports = {
  // 创建用户
  createUser: {
    email: { type: 'string', required: true, desc: '邮箱' },
    password: { type: 'string', required: true, desc: '密码' },
    uuid: { type: 'string', required: false, desc: 'uuid' },
    code: { type: 'string', required: true, desc: '验证码' },
  },

  // 创建管理员
  createAdmin: {
    email: { type: 'string', required: true, desc: '邮箱' },
    password: { type: 'string', required: true, desc: '密码' },
    uuid: { type: 'string', required: false, desc: 'uuid' },
    code: { type: 'string', required: true, desc: '验证码' },
  },
};
