'use strict';

// 礼物表
module.exports = {
  up: (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE } = Sequelize;
    return queryInterface.createTable('gift', {
      id: {
        type: INTEGER(20).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: STRING(30),
        allowNull: false,
        defaultValue: '',
        comment: '礼物名称',
      },
      image: {
        type: STRING(200),
        allowNull: true,
        defaultValue: '',
        comment: '礼物图标',
      },
      coin: {
        type: INTEGER(15),
        allowNull: false,
        defaultValue: 0,
        comment: '金币',
      },
      created_at: DATE,
      updated_at: DATE,
      deleted_at: { type: DATE, allowNull: true, defaultValue: null },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('gift');
  },
};
