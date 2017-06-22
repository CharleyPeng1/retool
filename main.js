/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

const express = require('express')
const { fork } = require('child_process')

require('dotenv').config()

let app
if (process.env.RETOOL_HOSTED) {
  app = require('./app')
  app.listen(process.env.PORT || 3001)
} else {
  console.log('Starting main server up...')
  app = require('./app')
  app.listen(process.env.PORT || 3001)
  fork('./dbconnector/main.js')
  fork('./http_server/main.js')
}

module.exports = app
