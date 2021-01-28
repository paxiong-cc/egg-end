'use strict';

// 用户表
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, ENUM } = Sequelize;
    // 创建表
    await queryInterface.createTable('user', {
      id: { type: INTEGER(20).UNSIGNED, primaryKey: true, autoIncrement: true },
      username: { type: STRING(30), allowNull: false, defaultValue: '', comment: '用户名称', unique: true },
      password: { type: STRING(200), allowNull: false, defaultValue: '' },
      avatar_url: { type: STRING(200), allowNull: true, defaultValue: '' },
      sex: { type: ENUM, values: [ '男', '女', '保密' ], allowNull: false, defaultValue: '男', comment: '用户性别' },
      // sex: { type: ENUM, values: [ '0', '1', '2' ], allowNull: false, defaultValue: '0', comment: '用户性别: 0-男 1-女 2-保密' },
      level: { type: ENUM, values: [ '0', '1', '2' ], allowNull: false, defaultValue: '2', comment: '级别: 0-超管 1-管理员 2-用户' },
      mobile: { type: INTEGER(20) },
      wx: { type: STRING(50), allowNull: true, defaultValue: null, unique: true },
      qq: { type: INTEGER(20), allowNull: true, defaultValue: null, unique: true },
      coin: { type: INTEGER(20), allowNull: true, defaultValue: 0, comment: '积分' },
      email: { type: STRING(50), allowNull: true, defaultValue: '', unique: true },
      delete: { type: ENUM, values: [ '0', '1' ], allowNull: false, defaultValue: '1', comment: '是否删除,0-否1-删除' },
      created_at: DATE,
      updated_at: DATE,
      deleted_at: { type: DATE, allowNull: true, defaultValue: null },
    });
  },

  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user');
  },
};
