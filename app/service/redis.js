// app/service/redis.js
'use strict';

const Service = require('egg').Service;

class ReidsService extends Service {
  /**
   * 设置缓存
   * @param {string | number} key 键
   * @param {any} value 值
   * @param {timestamp} time 时间S
   */
  async set(key, value, time) {
    const { app } = this;
    await app.redis.set(key, value, 'EX', time);
  }

  /**
   * 获取单个缓存
   * @param {string | number} key 键
   */
  async get(key) {
    const { app } = this;
    const result = await app.redis.get(key);
    return result;
  }

  /**
   * 清空单个缓存
   * @param {string | number} key 键
   */
  async del(key) {
    const { app } = this;
    await app.redis.del(key);
  }
}
module.exports = ReidsService;
