'use strict';

// 礼物表
module.exports = {
  up: (queryInterface, Sequelize) => {
    const { INTEGER, DATE } = Sequelize;
    return queryInterface.createTable('coin_list', {
      id: {
        type: INTEGER(20).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      coin: {
        type: INTEGER(20),
        allowNull: false,
        defaultValue: 0,
      },
      cost: {
        type: INTEGER(20),
        allowNull: false,
        defaultValue: 0,
      },
      delete: {
        type: INTEGER(20),
        allowNull: false,
        defaultValue: 0,
      },
      created_at: DATE,
      updated_at: DATE,
      deleted_at: { type: DATE, allowNull: true, defaultValue: null },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('coin_list');
  },
};
