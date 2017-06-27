/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

'use strict'

module.exports = function (sequelize, DataTypes) {
  var Page = sequelize.define('page', {
    name: DataTypes.STRING,
  })
  Page.associate = (models) => {
    Page.belongsTo(models.Organization, {
      foreignKey: 'organization_id',
      onDelete: 'CASCADE',
    })
    Page.hasMany(models.PageSave, {
      foreignKey: 'page_id',
      as: 'saves',
    })
  }
  return Page
}
