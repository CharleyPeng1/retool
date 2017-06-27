/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */
const deepEqual = require('deep-equal')

const pgDriver = require('./postgres.js')
const mysqlDriver = require('./mysql.js')
const mongoDriver = require('./mongodb.js')
const googleSheetsDriver = require('./googleSheets.js')

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
    case 'googlesheets':
      return googleSheetsDriver
  }
}

function createPool (resource) {
  const driver = resolveDriver(resource)
  return driver.createPool(resource)
}

function createClient (resource, user) {
  const driver = resolveDriver(resource)
  return driver.createClient(resource)
}

function testConnection (resource, user) {
  const client = createClient(resource, user)
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

function resourceChanged (r1, r2) {
  return !deepEqual(r1, r2)
}

function getPool (resource) {
  switch (resource.type) {
    case 'googlesheets':
      return null
    default:
      if (!pools[resource.id] || resourceChanged(pools[resource.id].resource, resource)) {
        const newPool = createPool(resource)
        if (newPool) {
          pools[resource.id] = {
            pool: newPool,
            resource,
          }
        }
      }
      return pools[resource.id].pool
  }
}

// Gets the schema for a resource
function getSchema (resource) {
  const pool = getPool(resource)
  const driver = resolveDriver(resource)
  return driver.getSchema(pool, resource)
}

// Runs a parameterized query.
function runQuery (resource, query, params, options, user) {
  const pool = getPool(resource)
  const driver = resolveDriver(resource)
  return driver.runQuery(pool, query, params, options, resource, user)
}

module.exports = {
  runQuery,
  getPool,
  testConnection,
  getSchema,
}
