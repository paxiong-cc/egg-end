'use strict';

/**
 * 公共
 */
module.exports = {
  // 登录
  login: {
    email: { type: 'string', required: true, desc: '邮箱' },
    password: { type: 'string', required: true, desc: '密码' },
    uuid: { type: 'string', required: false, desc: 'uuid' },
    code: { type: 'string', required: true, desc: '验证码' },
  },
};
