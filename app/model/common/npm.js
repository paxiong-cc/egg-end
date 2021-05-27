'use strict';

// common/用户表
module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM } = app.Sequelize;

  const Npm = app.model.define('npm', {
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
    created_at: DATE,
    updated_at: DATE,
    deleted_at: { type: DATE, allowNull: true, defaultValue: null },
  });

  return Npm;
};
