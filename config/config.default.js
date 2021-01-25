/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1609913759642_7175';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  // 数据库配置
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: '123456',
    port: 3306,
    database: 'paxiong',
    // 中国时区
    timezone: '+08:00',
    define: {
      // 取消数据表名复数
      freezeTableName: true,
      // 自动写入时间戳 created_at updated_at
      timestamps: true,
      // 字段生成软删除时间戳 deleted_at
      paranoid: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      // 所有驼峰命名格式化
      underscored: true,
    },
  };

  config.security = {
    // 关闭 csrf
    csrf: {
      headerName: 'x-csrf-token',
      ignore: ctx => {
        return ctx.request.url.startsWith('/');
      },
    },
  };

  // 允许跨域的方法
  config.cors = {
    origin: '*',
    allowMethods: 'GET, PUT, POST, DELETE, PATCH',
  };

  // 参数验证
  config.valparams = {
    locale: 'zh-cn',
    throwError: true,
  };

  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: '',
      db: 0,
    },
  };

  config.jwt = {
    secret: 'paxiong_',
  };

  /* 中间件 */
  config.middleware = [ 'errorHandler', 'auth', 'authManager' ]; // 异常处理 权限验证
  config.auth = {
    ignore: [
      '/common',
    ],
  };
  config.authManager = {
    match: [
      '/manager',
    ],
  };


  // 文件上传
  config.multipart = {
    fileSize: '50mb',
    mode: 'stream',
    fileExtensions: [ '.xls', '.txt', '.jpg', '.JPG', '.png', '.PNG', '.gif', '.GIF', '.jpeg', '.JPEG' ], // 扩展几种上传的文件格式
  };

  config.custom = {
    tokenExp: '24h', // token时效
    codeExp: 50 * 60, // 验证码时效 s为单位
    fileMax: 1 * 1024 * 10, // 上传的文件大小
  };

  return {
    ...config,
    ...userConfig,
  };
};
