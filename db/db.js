/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

const fetch = require('node-fetch')
require('dotenv').config()

function processResult (res) {
  if (res.ok) {
    return res.json()
  } else {
    return res.json()
      .then(json => {
        console.log(json)
        throw new Error(json.error)
      })
  }
}

const connectorBaseUrl = process.env.DB_CONNECTOR_HOST && process.env.DB_CONNECTOR_PORT
  ?  `${process.env.DB_CONNECTOR_HOST}:${process.env.DB_CONNECTOR_PORT}`
  :  'http://localhost:3002'

function testConnection (resource, user) {
  return fetch(`${connectorBaseUrl}/api/testConnection`, {
    method: 'POST',
    body: JSON.stringify({resource, user}),
    headers: { 'Content-Type': 'application/json' },
  }).then(processResult)
}

// Gets the schema for a resource
function getSchema (resource) {
  return fetch(`${connectorBaseUrl}/api/getSchema`, {
    method: 'POST',
    body: JSON.stringify(resource),
    headers: { 'Content-Type': 'application/json' },
  }).then(processResult)
}

// Runs a parameterized query.
function runQuery (resource, query, params, options, user) {
  return fetch(`${connectorBaseUrl}/api/runQuery`, {
    method: 'POST',
    body: JSON.stringify({ resource, query, params, options, user }),
    headers: { 'Content-Type': 'application/json' },
  }).then(processResult)
}

module.exports = {
  runQuery,
  testConnection,
  getSchema,
}
