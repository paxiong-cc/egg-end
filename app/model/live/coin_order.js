'use strict';

// live/金币订单表
module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM } = app.Sequelize;

  const CoinOrder = app.model.define('coin_order', {
    id: {
      type: INTEGER(20),
      primaryKey: true,
      autoIncrement: true,
    },
    no: {
      type: STRING(100),
      allowNull: false,
      defaultValue: '',
      comment: '订单号',
      unique: true,
    },
    user_id: {
      type: INTEGER(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '用户id',
      references: {
        model: 'user',
        key: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'restrict', // 更新时操作
    },
    coin_list_id: {
      type: INTEGER(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: 'coin_list的id',
      references: {
        model: 'coin_list',
        key: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'restrict', // 更新时操作
    },
    status: {
      type: ENUM,
      values: [ 'pending', 'success', 'fail' ],
      allowNull: false,
      defaultValue: 'pending',
      comment: '支付状态',
    },
    created_at: DATE,
    updated_at: DATE,
    deleted_at: { type: DATE, allowNull: true, defaultValue: null },
  });

  // 关联关系
  CoinOrder.associate = function() {
    // 关联用户
    CoinOrder.belongsTo(app.model.Common.User);
    // 关联礼物列表
    CoinOrder.belongsTo(app.model.Live.CoinList);
  };

  return CoinOrder;
};
