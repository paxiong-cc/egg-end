'use strict';

// live/金币订单表
module.exports = app => {
  const { INTEGER, DATE } = app.Sequelize;

  const CoinList = app.model.define('coin_list', {
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
      defaultValue: 0, // 0-正常 1-删除
    },
    created_at: DATE,
    updated_at: DATE,
    deleted_at: { type: DATE, allowNull: true, defaultValue: null },
  });

  return CoinList;
};
