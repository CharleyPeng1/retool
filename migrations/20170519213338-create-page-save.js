/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('page_saves', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      data: {
        type: Sequelize.JSON,
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
      page_id: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'pages',
          key: 'id',
          as: 'page_id',
        },
      },
    })
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('page_saves')
  },
}
