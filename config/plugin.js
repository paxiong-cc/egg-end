'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },

  cors: {
    enable: true,
    package: 'egg-cors',
  },

  // 参数验证
  valparams: {
    enable: true,
    package: 'egg-valparams',
  },

  redis: {
    enable: true,
    package: 'egg-redis',
  },

  // {app_root}/config/plugin.js
  jwt: {
    enable: true,
    package: 'egg-jwt',
  },

  // swagger
  swaggerdoc: {
    enable: true,
    package: 'egg-swagger-doc',
  },
};
