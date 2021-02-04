'use strict';

// live/礼物表
module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Gift = app.model.define('gift', {
    id: {
      type: INTEGER(20).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: STRING(30),
      allowNull: false,
      defaultValue: '',
      unique: true,
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

  return Gift;
};
