/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

const pg = require('pg')
const common = require('./common.js')

function toConfig (db) {
  return {
    user: db.databaseUsername,
    password: db.databasePassword,
    database: db.databaseName,
    port: db.port,
    host: db.host,
  }
}

function createPool (db) {
  return new pg.Pool(toConfig(db))
}

function createClient (db) {
  const pgClient = new pg.Client(toConfig(db))
  return {
    connect: (cb) => pgClient.connect(cb),
    close: () => pgClient.end(),
  }
}

const scheamQuery = `
SELECT column_name, data_type, table_name
FROM information_schema.columns
WHERE table_schema = 'public'
`
function getSchema (pool, db) {
  return new Promise((resolve, reject) => {
    pool.connect((err, client, done) => {
      if (err) {
        done()
        return reject(err)
      }

      client.query(scheamQuery, [], (err, result) => {
        if (err) {
          done(err)
          reject(err)
        } else {
          done()
          resolve(common.formatSchema(result.rows))
        }
      })
    })
  })
}

function convertToParameterizedQuery (query) {
  let cur = 0
  return query.replace(common.templateRegex, (v) => {
    cur += 1
    return `$${cur}`
  })
}

function runQuery (pool, query, params) {
  const parameterizedQuery = convertToParameterizedQuery(query)
  return new Promise((resolve, reject) => {
    pool.connect((err, client, done) => {
      if (err) {
        console.error('Error in fetching client from pool', err)
        done()
        return reject(err)
      }

      client.query(parameterizedQuery, params, (err, result) => {
        if (err) {
          done(err)
          reject(err)
        } else {
          done()
          resolve(common.keyByColumn(result.fields, result.rows))
        }
      })
    })
  })
}

module.exports = {
  createPool,
  createClient,
  getSchema,
  runQuery,
}
