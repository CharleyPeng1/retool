/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

const express = require('express')
const path = require('path')

console.log('Staring static http server')

const app = express()
app.use(express.static('./dist'))
app.use((req, res) => {
  res.sendFile(path.resolve('dist/index.html'))
})
app.listen(3000)
