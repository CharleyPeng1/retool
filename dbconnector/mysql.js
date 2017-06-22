/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

const mysql = require('mysql')
const common = require('./common.js')

function toConfig (db) {
  return {
    user: db.databaseUsername,
    password: db.databasePassword,
    database: db.databaseName,
    port: db.port,
    host: db.host,
    connectionLimit: 5,
  }
}

function createPool (db) {
  return mysql.createPool(toConfig(db))
}

function createClient (db) {
  const mysqlConn  = mysql.createConnection(toConfig(db))
  return {
    connect: (cb) => mysqlConn.connect(cb),
    close: () => mysqlConn.end(),
  }
}

function genSchemaQuery (db) {
  return `
SELECT column_name, data_type, table_name
FROM information_schema.columns
WHERE table_schema = '${db.databaseName}'
`
}
function getSchema (pool, db) {
  return new Promise((resolve, reject) => {
    pool.query(genSchemaQuery(db), (err, results) => {
      if (err) {
        reject(err)
      } else {
        resolve(common.formatSchema(results))
      }
    })
  })
}

function convertToParameterizedQuery (query) {
  return query.replace(common.templateRegex, (v) => {
    return ` ? `
  })
}

function runQuery (pool, query, params) {
  const parameterizedQuery = convertToParameterizedQuery(query)
  return new Promise((resolve, reject) => {
    pool.query(parameterizedQuery, params, (err, results, fields) => {
      if (err) {
        reject(err)
      } else {
        resolve(common.keyByColumn(fields, results))
      }
    })
  })
}

module.exports = {
  createPool,
  createClient,
  getSchema,
  runQuery,
}
