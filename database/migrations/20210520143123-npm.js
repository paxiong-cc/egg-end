'use strict';

// 礼物表
module.exports = {
  up: (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE } = Sequelize;
    return queryInterface.createTable('npm', {
      id: {
        type: INTEGER(20).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: STRING(30),
        allowNull: false,
        defaultValue: '',
        comment: '模板名',
      },
      npm_name: {
        type: STRING(200),
        allowNull: true,
        defaultValue: '',
        comment: 'npm包名',
      },
      version: {
        type: STRING(15),
        allowNull: false,
        comment: '版本号',
      },
      type: {
        type: STRING(15),
        allowNull: false,
        comment: '类型',
      },
      type: {
        type: STRING(15),
        allowNull: false,
        comment: '类型 default custom',
      },
      tag: {
        type: STRING(15),
        allowNull: false,
        comment: '类型 project component',
      },
      ignore: {
        type: STRING(200),
        allowNull: false,
        comment: '忽略文件',
      },
      created_at: DATE,
      updated_at: DATE,
      deleted_at: { type: DATE, allowNull: true, defaultValue: null },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('npm');
  },
};
