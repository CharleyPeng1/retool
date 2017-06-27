/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

'use strict'
module.exports = function (sequelize, DataTypes) {
  var Organization = sequelize.define('organization', {
    domain: DataTypes.STRING,
    name: DataTypes.STRING,
    hostname: DataTypes.STRING,
  })

  Organization.associate = (models) => {
    Organization.hasMany(models.User, {
      foreignKey: 'organization_id',
      as: 'users',
    })
    Organization.hasMany(models.Page, {
      foreignKey: 'organization_id',
      as: 'pages',
    })
    Organization.hasMany(models.Resource, {
      foreignKey: 'organization_id',
      as: 'resources',
    })
  }

  Organization.prototype.toJSON = function () {
    // https://github.com/sequelize/sequelize/issues/1462
    return Object.assign({}, this.get())
  }
  return Organization
}
