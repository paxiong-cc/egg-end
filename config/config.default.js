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
    host: 'http://47.115.60.210',
    username: 'root',
    password: '123456',
    port: 3306,
    database: 'paxiong',
    // 中国时区
    timezone: '+08:00',
    define: {
      charset: 'utf8',
      dialectOptions: {
        collate: 'utf8_general_ci',
      },
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

  // swagger
  // {app_root}/config/config.default.js
  config.swaggerdoc = {
    dirScanner: './app/controller',
    apiInfo: {
      title: 'egg-swagger',
      description: 'swagger-ui for egg',
      version: '1.0.0',
    },
    schemes: [ 'http', 'https' ],
    consumes: [ 'application/json' ],
    produces: [ 'application/json' ],
    securityDefinitions: {
      token: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    // oauth2: {
    //   type: 'oauth2',
    //   tokenUrl: 'http://petstore.swagger.io/oauth/dialog',
    //   flow: 'password',
    //   scopes: {
    //     'write:access_token': 'write access_token',
    //     'read:access_token': 'read access_token',
    //   },
    // },
    },
    enableSecurity: true,
    // enableValidate: true,
    routerMap: false,
    enable: true,
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
      host: 'http://47.115.60.210', // Redis host
      password: '',
      db: 0,
    },
  };

  config.jwt = {
    secret: 'paxiong_',
  };

  /* 中间件 */
  config.middleware = [ 'errorHandler', 'auth', 'authManager' ]; // 异常处理 权限验证 管理员权限验证
  config.auth = {
    ignore: [
      '/common',
      ctx => ctx.path.startsWith('/swagger'),
      ctx => ctx.path.startsWith('/favicon'),
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
