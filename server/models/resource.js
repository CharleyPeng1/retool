/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

'use strict'
const _ = require('lodash')

module.exports = function (sequelize, DataTypes) {
  var Resource = sequelize.define('resource', {
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    host: DataTypes.STRING,
    port: DataTypes.STRING,
    databaseName: DataTypes.STRING,
    databaseUsername: DataTypes.STRING,
    databasePassword: DataTypes.STRING,
  })

  Resource.associate = (models) => {
    Resource.belongsTo(models.Organization, {
      foreignKey: 'organization_id',
      onDelete: 'CASCADE',
    })
  }

  Resource.prototype.toJSON = function () {
    const editorMap = {
      postgresql: 'SqlQuery',
      mysql: 'SqlQuery',
      redshift: 'SqlQuery',
      http: 'ApiQuery',
      mongodb: 'NoSqlQuery',
      googlesheets: 'GoogleSheetsQuery',
    }

    // https://github.com/sequelize/sequelize/issues/1462
    var privateAttributes = ['databasePassword']

    const omitted = _.omit(this.get(), privateAttributes)
    omitted.editorType = editorMap[this.get('type')]
    return omitted
  }
  return Resource
}
