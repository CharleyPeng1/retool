/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('pages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      organization_id: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'organizations',
          key: 'id',
          as: 'organization_id',
        },
      },
    })
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('pages')
  },
}
