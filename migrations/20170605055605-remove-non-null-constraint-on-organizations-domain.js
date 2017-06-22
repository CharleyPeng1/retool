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
      'organizations',
      'domain',
      {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'organizations',
      'domain',
      {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      }
    )
  },
}
