/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

require('dotenv').config()

module.exports = {
  development: {
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: 'postgres',
  },
  test: {
    database: 'hammerhead_test',
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: 'postgres',
    logging: false,
  },
  local: {
    database: 'retool',
    username: 'retool',
    password: 'retool',
    dialect: 'sqlite',
    pool: {
      max: 5,
      min: 0,
      idle: 100000,
    },
    storage: './retool.db'
  }
}
