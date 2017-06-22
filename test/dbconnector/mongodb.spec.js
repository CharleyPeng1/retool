/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

require('../common.js')
const mongoDriver = require('../../dbconnector/mongodb.js')

describe('Mongodb Driver', () => {
  const db = {
    name: 'MongoTest',
    type: 'mongodb',
    host: 'localhost',
    port: '27017',
    databaseName: 'retool_test',
    databaseUsername: '',
    databasePassword: '',
  }

  describe('Connection and metadata', () => {
    it('Should create a mongodb client correctly', () => {
      const client = mongoDriver.createPool(db)
      return client.collection('users').find({})
        .then((results) => {
          expect(results).to.deep.equal([])
        })
    })

    it('Should create a mongodb pool correctly', () => {
      const client = mongoDriver.createPool(db)
      return client.collection('users').find({})
        .then((results) => {
          expect(results).to.deep.equal([])
        })
    })
  })

  describe('Database querying', () => {
    let pool
    const george = {
      name: 'George Bloom',
      email: 'george@example.com',
      age: 24,
    }
    const boris = {
      name: 'Boris Johnson',
      email: 'boris@example.com',
      age: 24,
    }
    const emily = {
      name: 'Emily Childs',
      email: 'emily@example.com',
      age: 22,
    }

    const queryOptions = {
      collection: 'users',
      method: 'find',
    }

    beforeEach(() => {
      pool = mongoDriver.createPool(db)
      return pool.collection('users').insert([george, boris, emily])
    })

    afterEach(() => {
      return pool.collection('users').drop()
    })


    it('Should run the empty query', () => {
      return mongoDriver.runQuery(pool, '{}', [], queryOptions)
        .then((results) => {
          expect(results.length).to.be.equal(3)
        })
    })

    it('Should run queries with $in', () => {
      return mongoDriver.runQuery(pool, '{ "age": { "$in": [24, 22] } }', [], queryOptions)
        .then((results) => {
          expect(results.length).to.be.equal(3)
        })
    })

    it('Should run a simple parameterized query', () => {
      const query = JSON.stringify({
        email: '{{ w1.value }}'
      })
      const params = [george.email]
      return mongoDriver.runQuery(pool, query, params, { collection: 'users'})
        .then((results) => {
          expect(results.length).to.be.equal(1)
          expect(results[0]).to.be.deep.equal(george)
        })
    })

    it('Should run multi-parameter queries 1', () => {
      const query = JSON.stringify({
        email: '{{ w1.value }}@{{ w2.value }}'
      })
      const params = george.email.split('@')
      return mongoDriver.runQuery(pool, query, params, queryOptions)
        .then((results) => {
          expect(results.length).to.be.equal(1)
          expect(results[0]).to.be.deep.equal(george)
        })
    })

    it('Should run multi-parameter queries 2', () => {
      const query = JSON.stringify({
        email: '{{ a }}@{{ b }}.com'
      })
      const params = ['george', 'example']
      return mongoDriver.runQuery(pool, query, params, { collection: 'users'})
        .then((results) => {
          expect(results.length).to.be.equal(1)
          expect(results[0]).to.be.deep.equal(george)
        })
    })

    it('Should run parameterized query over number datatypes', () => {
      const query = JSON.stringify({
        age: '{{ w1.value }}'
      })
      const params = [24]
      return mongoDriver.runQuery(pool, query, params, queryOptions)
        .then((results) => {
          expect(results.length).to.be.equal(2)
          expect(results[0]).to.be.deep.equal(george)
          expect(results[1]).to.be.deep.equal(boris)
        })
    })
  })

  describe('Database schema querying', () => {
    let pool
    const george = {
      name: 'George Bloom',
      email: 'george@example.com',
    }

    beforeEach(() => {
      pool = mongoDriver.createPool(db)
      return pool.collection('users').insert([george])
    })

    afterEach(() => {
      return pool.collection('users').drop()
    })

    it('Should return correct metadata', () => {
      return mongoDriver.getSchema(pool, db)
        .then((collections) => {
          expect(collections).to.be.deep.equal({ users: {} })
        })
    })
  })
})
