/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('organizations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      domain: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hostname: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }).then(() => {
      queryInterface.createTable('users', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        email: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false,
        },
        firstName: {
          type: Sequelize.STRING,
        },
        lastName: {
          type: Sequelize.STRING,
        },
        profilePhotoUrl: {
          type: Sequelize.STRING,
          unique: true,
        },
        googleId: {
          type: Sequelize.STRING,
          unique: true,
        },
        googleToken: {
          type: Sequelize.STRING,
          unique: true,
        },
        hashedPassword: {
          type: Sequelize.STRING,
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
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
    })
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('users').then(() => queryInterface.dropTable('organizations'))
  },
}
