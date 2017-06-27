/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

const { keyByColumn } = require('./common.js')

const google = require('googleapis')
const GoogleAuth = require('google-auth-library')

const CLIENT_ID = '716367306867-d861tjqj92gjb0uphcjt8gu2nvtf6e9t.apps.googleusercontent.com'
const CLIENT_SECRET = process.env.CLIENT_SECRET

const sheets = google.sheets('v4')

function runQuery (pool, query, params, options, resource, user) {
  const auth = new GoogleAuth()

  let oauth2Client = new auth.OAuth2(CLIENT_ID, CLIENT_SECRET)
  oauth2Client.credentials = JSON.parse(user.googleToken)

  return new Promise((resolve, reject) => {
    console.log(sheets.spreadsheets)
    sheets.spreadsheets.values.get({
      auth: oauth2Client,
      spreadsheetId: options.sheetId,
      range: options.sheetRange,
    }, function (err, response) {
      if (err) {
        reject(err)
      } else {
        resolve(keyByColumn(Object.keys(response.values).map(k => ({ name: k })), response.values))
      }
    })
  })
}

module.exports = {
  runQuery,
}
