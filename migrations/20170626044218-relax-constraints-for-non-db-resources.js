/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'resources',
      'host',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    )
    queryInterface.changeColumn(
      'resources',
      'port',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    )
    queryInterface.changeColumn(
      'resources',
      'databaseName',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    )
    queryInterface.changeColumn(
      'resources',
      'databaseUsername',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    )
    queryInterface.changeColumn(
      'resources',
      'databasePassword',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'resources',
      'host',
      {
        type: Sequelize.STRING,
        allowNull: false,
      }
    )
    queryInterface.changeColumn(
      'resources',
      'port',
      {
        type: Sequelize.STRING,
        allowNull: false,
      }
    )
    queryInterface.changeColumn(
      'resources',
      'databaseName',
      {
        type: Sequelize.STRING,
        allowNull: false,
      }
    )
    queryInterface.changeColumn(
      'resources',
      'databaseUsername',
      {
        type: Sequelize.STRING,
        allowNull: false,
      }
    )
    queryInterface.changeColumn(
      'resources',
      'databasePassword',
      {
        type: Sequelize.STRING,
        allowNull: false,
      }
    )
  }
};
