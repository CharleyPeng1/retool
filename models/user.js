/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

'use strict'
const _ = require('lodash')

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('user', {
    email: DataTypes.STRING,
    hashedPassword: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    profilePhotoUrl: DataTypes.STRING,
    googleId: DataTypes.STRING,
    googleToken: DataTypes.STRING,
  })

  User.associate = (models) => {
    User.belongsTo(models.Organization, {
      foreignKey: 'organization_id',
      onDelete: 'CASCADE',
    })
  }

  User.prototype.toJSON = function () {
    // https://github.com/sequelize/sequelize/issues/1462
    var privateAttributes = ['googleToken', 'googleId', 'hashedPassword']

    return _.omit(this.get(), privateAttributes)
  }
  return User
}
