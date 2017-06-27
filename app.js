/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

const bodyParser = require('body-parser')
const compress = require('compression')
const cors = require('cors')
const express = require('express')

const auth = require('./modules/auth.js')

const app = express()

// apply CORS

var whitelist = ['https://retool.in', 'http://localhost:3000', 'http://localhost:3001', 'https://app.retool.in', 'https://demo.retool.in']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error(`${origin} Not allowed by CORS`))
    }
  },
}

app.options('*', cors())
app.use(cors(corsOptions))

// Apply gzip compression
app.use(compress())
app.use(bodyParser({ limit: '50mb' }))

// apply authentication
app.use(auth.authenticationMiddleware)

require('./routes')(app)

module.exports = app
