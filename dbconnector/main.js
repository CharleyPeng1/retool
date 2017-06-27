/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

console.log('Starting database connector server')
const app = require('./app')
app.listen(process.env.DB_CONNECTOR_PORT || 3002)
