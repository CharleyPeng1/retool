/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

const { configs } = require('../common.js')
const db = require('../../server/db/db.js')

describe('Database Connector Client', () => {
  describe('Testing connections', () => {
    it('Should validate working postgres config', () => {
      return db.testConnection(configs.postgres)
        .then((result) => {
          expect(result).to.deep.equal(configs.postgres)
        })
    })
  })

  describe('Getting schemas', () => {
    it('Should retrieve schemas from working postgres config', () => {
      return db.getSchema(configs.postgres)
        .then((result) => {
          expect(result).to.not.be.null
          expect(result).to.be.an('object')
        })
    })
  })

  describe('Running queries', () => {
    it('Should run queries correctly', () => {
      return db.runQuery(configs.postgres, 'SELECT 1 as one', [])
        .then((result) => {
          expect(result).to.not.be.null
          expect(result).to.be.an('object')
          expect(result).to.deep.equal({ one: [ 1 ] })
        })
      .catch(err => {
        console.log(err)
      })
    })
  })
})
