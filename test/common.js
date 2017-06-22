/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

/* Common file that sets up the testing environment */

const chaiHttp = require('chai-http')

// Make the chai 'expect' function global
global.chai = require('chai')
global.chai.use(chaiHttp)
global.expect = chai.expect
global.server = require('../app.js')
global.databaseConnector = require('../dbconnector/app.js')

// Make the sequelize db object global
console.log('Initializing sequelize ORM.\n')
global.models = require('../models')
console.log('\nStarting tests.')

// For setting up test database data
const fixtures = require('sequelize-fixtures')

// Start the app and dbconnector servers
const app = require('../app.js')
const dbconnector = require ('../dbconnector/app.js')
let appServer
let databaseConnectorServer
before((done) => {
  appServer = app.listen(3001, () => {
    databaseConnectorServer = dbconnector.listen(3002, () => {
      done()
    })
  })
})

after(() => {
  appServer.close()
  databaseConnectorServer.close()
})

beforeEach(() => {
  // Ensure sequelize can connect to the database
  return models.sequelize.authenticate()
    .then((err) => {
      if (err) {
        throw err
      }
      if (process.env.NODE_ENV !== 'test') {
        throw new Error(`Node environment must be 'test.' ${process.env.NODE_ENV} found instead`)
      }

      // Sync ORM and clean database. `force: true` drops all the current tables.
      return models.sequelize.sync({ force: true })
    })
    .then(() => {
      // Seed the database now. Suppress logging by specifying in an empty log function
      return fixtures.loadFile('test/fixtures/*.yaml', models, { log: () => { } })
    })
})


// Define some useful constants
const configs = {
  postgres: {
    id: 1,
    name: 'PostgresTest',
    type: 'postgresql',
    host: 'localhost',
    port: '5432',
    databaseName: 'postgres',
    databaseUsername: 'postgres',
    databasePassword: 'postgres',
  },
  mysql: {
    id: 2,
    name: 'MySQLTest',
    type: 'mysql',
    host: 'localhost',
    port: '3306',
    databaseName: 'information_schema',
    databaseUsername: 'retool_read_only_user',
    databasePassword: 'secure_password',
  },
  mongodb: {
    id: 3,
    name: 'MongoTest',
    type: 'mongodb',
    host: 'localhost',
    port: '27017',
    databaseName: 'mongo_test',
    databaseUsername: '',
    databasePassword: '',
  },
}

module.exports = {
  configs
}
