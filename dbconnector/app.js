/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

const bodyParser = require('body-parser')
const express = require('express')
const db = require('./db')
const app = express()

const forwardToHandler = handler => (req, res) => {
  try {
    handler(req.body)
      .then((result) => {
        res.send(result)
      })
      .catch((error) => {
        res.status(400).send({ error: error.message })
      })
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
}

// Apply gzip compression
app.use(bodyParser({ limit: '50mb' }))

// apply authentication
app.post('/api/testConnection', forwardToHandler(db.testConnection))
app.post('/api/getSchema', forwardToHandler(db.getSchema))
app.post('/api/runQuery', (req, res) => {
  const { resource, query, params, options } = req.body
  try {
    db.runQuery(resource, query, params, options)
      .then((result) => {
        res.send(result)
      })
      .catch((error) => {
        res.status(400).send({ error: error.message })
      })
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
})

module.exports = app
