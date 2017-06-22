/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

'use strict'
module.exports = function (sequelize, DataTypes) {
  var PageSave = sequelize.define('pageSave', {
    data: DataTypes.JSON,
  }, { tableName: 'page_saves' })
  PageSave.associate = (models) => {
    PageSave.belongsTo(models.Page, {
      foreignKey: 'page_id',
      onDelete: 'CASCADE',
    })

  }
  return PageSave
}
