/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

'use strict'

var fs = require('fs')
var path = require('path')
var Sequelize = require('sequelize')
var basename = path.basename(module.filename)
var env = process.env.NODE_ENV || 'development'
var configPath = path.join(__dirname, '/../config.js')
var config = require(configPath)[env]
var db = {}

var sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable])
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(function (file) {
    var model = sequelize['import'](path.join(__dirname, file))
    const capitalizedName = model.name.charAt(0).toUpperCase() + model.name.slice(1)
    db[capitalizedName] = model
  })

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize

module.exports = db
