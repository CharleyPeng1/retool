/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

require ('../common.js')

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
describe('Database Connector App', () => {
  describe('/api/testConnection endpoint', () => {
    it('Should validate working postgres config', () => {
      return chai.request(databaseConnector)
        .post('/api/testConnection')
        .send(configs.postgres)
        .then((res) => {
          expect(res.body).to.deep.equal(configs.postgres)
        })
    })
    
    it('Should reject incorrect postgres config', () => {
      return chai.request(databaseConnector)
        .post('/api/testConnection')
        .send(Object.assign({}, configs.postgres, { databaseName: 'UNKNOWN_DATABASE' }))
        .then((res) => {
          expect(res).to.be.undefined
        })
        .catch((err) => {
          expect(err).to.not.be.null
          expect(err.response.body.error).to.be.equal('database "UNKNOWN_DATABASE" does not exist')
        })
    })

    it('Should load database schema', () => {
      return chai.request(databaseConnector)
        .post('/api/getSchema')
        .send(configs.postgres)
        .then((result) => {
          expect(result).to.not.be.null
          expect(result).to.be.an('object')
        })
    })
  })
})
