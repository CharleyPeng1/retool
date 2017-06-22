/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

const pgDriver = require('./postgres.js')
const mysqlDriver = require('./mysql.js')
const mongoDriver = require('./mongodb.js')

const pools = {}

function resolveDriver (resource) {
  switch (resource.type) {
    case 'redshift':
    case 'postgresql':
      return pgDriver
    case 'mysql':
      return mysqlDriver
    case 'mongodb':
      return mongoDriver
  }
}

function createPool (resource) {
  const driver = resolveDriver(resource)
  return driver.createPool(resource)
}

function createClient (resource) {
  const driver = resolveDriver(resource)
  return driver.createClient(resource)
}

function testConnection (resource) {
  const client = createClient(resource)
  return new Promise((resolve, reject) => {
    client.connect((err) => {
      if (err) {
        reject(err)
      } else {
        client.close()
        resolve(resource)
      }
    })
  })
}

function getPool (resource) {
  if (!pools[resource.id]) {
    const newPool = createPool(resource)
    if (newPool) {
      pools[resource.id] = newPool
    }
  }
  return pools[resource.id]
}

// Gets the schema for a resource
function getSchema (resource) {
  const pool = getPool(resource)
  const driver = resolveDriver(resource)
  return driver.getSchema(pool, resource)
}

// Runs a parameterized query.
function runQuery (resource, query, params, options) {
  const pool = getPool(resource)
  const driver = resolveDriver(resource)
  return driver.runQuery(pool, query, params, options)
}

module.exports = {
  runQuery,
  getPool,
  testConnection,
  getSchema,
}
