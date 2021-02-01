'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, ENUM } = Sequelize;
    return queryInterface.createTable('coin_order', {
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
  },

  down: queryInterface => {
    return queryInterface.dropTable('order');
  },
};
