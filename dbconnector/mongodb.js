/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

const format = require('util').format
const monk = require('monk')
const MongoClient = require('mongodb').MongoClient

const common = require('./common.js')

function toUrl (db) {
  const auth = db.databaseUsername && db.databasePassword
    ? format('%s:%s@', db.databaseUsername, db.databasePassword)
    : ''
  const host = format('%s:%s', db.host, db.port)
  const url = format('mongodb://%s%s/%s?authMechanism=%s',
    auth, host, db.databaseName, 'DEFAULT')
  return url
}

function toConfig (db) {
  return {
    poolSize: 10,
  }
}

function createPool (db) {
  return monk(toUrl(db))
}

function createClient (db) {
  let _db
  return {
    connect: (cb) => MongoClient.connect(toUrl(db), (err, db) => {
      _db = db
      cb(err)
    }),
    close: () => _db.close()
  }
}

function getSchema (pool, db) {
  // If pool._db is not initialized yet, we must first connect.
  let collectionsPromise
  if (!pool._db) {
    collectionsPromise = pool.then(() => pool._db.listCollections().toArray())
  } else {
    collectionsPromise = pool._db.listCollections().toArray()
  }
  return collectionsPromise
    .then((collections) => {
      return collections.reduce((acc, col) => {
        return Object.assign(acc, { [col.name]: {} })
      }, {})
    })
}

function deepMap (obj, func) {
  if (Array.isArray(obj)) {
    return obj.map(v => deepMap(v, func))
  }
  switch (typeof obj) {
    case 'object':
      return Object.keys(obj).reduce((acc, key) => {
        acc[key] = deepMap(obj[key], func)
        return acc
      }, {})
    default:
      return func(obj)
  }
}

function convertToQueryObject (query, params) {
  let queryObject = JSON.parse(query)

  let index = -1
  queryObject = deepMap(queryObject, (child) => {
    switch (typeof child) {
      case 'string':
        if (child.match(common.objectRegex)) {
          index += 1
          return params[index]
        } else {
          return child.replace(common.templateRegex, (v) => {
            index += 1
            return params[index]
          })
        }
      default:
        return child
    }
  })
  return queryObject
}

function queryCollection (collection, options, queryObject) {
  switch (options.method) {
    case 'find':
      return collection.find(queryObject)
    case 'findOne':
      return collection.findOne(queryObject)
    default:
      return collection.find(queryObject)
  }
}

function runQuery (pool, query, params, options) {
  return new Promise((resolve, reject) => {
    let queryObject
    try {
      queryObject = convertToQueryObject(query, params)
    } catch (err) {
      return reject(err)
    }
    const collection = pool.collection(options.collection)
    queryCollection(collection, options, queryObject)
      .then(results => resolve(results))
      .catch(err => reject(err))
  })
}

module.exports = {
  createPool,
  createClient,
  getSchema,
  runQuery,
}
