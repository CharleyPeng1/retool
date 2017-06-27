/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

const { configs } = require('../common.js')
const db = require('../../dbconnector/db')

describe('Database Manager', () => {
  describe('Database config validators', () => {
    describe('Postgres', () => {
      const postgres = configs.postgres

      it('Should validate working configs', () => {
        return db.testConnection(postgres)
          .then((result) => {
            expect(result).to.equal(postgres)
          })
      })

      it('Should reject configs with unknown database', () => {
        const invalid = Object.assign({}, postgres, {
          databaseName: 'UNKNOWN_DATABASE'
        })
        return db.testConnection(invalid)
          .then((result) => {
            expect(result).to.be.undefined
          })
          .catch((err) => {
            expect(err).to.not.be.null
            expect(err.message).to.be.equal('database "UNKNOWN_DATABASE" does not exist')
          })
      })

      it('Should reject configs with invalid database credentials', () => {
        const invalid = Object.assign({}, postgres, {
          databasePassword: 'INCORRECT_PASSWORD'
        })
        return db.testConnection(invalid)
          .then((result) => {
            expect(result).to.be.undefined
          })
          .catch((err) => {
            expect(err).to.not.be.null
            expect(err.message).to.be.equal('password authentication failed for user "postgres"')
          })
      })
    })

    describe('MySQL', () => {
      const mysql = configs.mysql
      it('Should validate working configs', () => {
        return db.testConnection(mysql)
          .then((result) => {
            expect(result).to.equal(mysql)
          })
      })
    })

    describe('MongoDB', () => {
      const mongodb = configs.mongodb

      it('Should validate working configs', () => {
        return db.testConnection(mongodb)
          .then((result) => {
            expect(result).to.equal(mongodb)
          })
      })
    })
  })

  describe('Database schema reader', () => {
    describe('Postgres', () => {
      it('Should load database schema', () => {
        return db.getSchema(configs.postgres)
          .then((result) => {
            expect(result).to.not.be.null
            expect(result).to.be.an('object')
          })
      })
    })

    describe('MySQL', () => {
      it('Should load database schema', () => {
      })
    })

    describe('MongoDB', () => {
      it('Should load database schema', () => {
        return db.getSchema(configs.mongodb)
          .then((result) => {
            expect(result).to.not.be.null
            expect(result).to.be.an('object')
          })
      })
    })
  })

  describe('Query forwarding', () => {
    describe('MongoDB', () => {
      const options = {
        collection: 'users',
        method: 'find',
      }

      it('Should forward queries', () => {
        db.runQuery(configs.mongodb, '{}', [], options)
          .then((result) => {
            expect(result).to.not.be.null
          })
      })
    })

    describe('GoogleSheets', () => {
      const options = {
        sheetId: '1FA8XdcOkpkU-8UY2uzZ7xLVyjFwVELJh_JkQyWdP3_E',
        sheetRange: 'A2:E',
      }
      const user = {
        googleToken: {
          "access_token": "ya29.Glt1BKZolj3f3kh-Y0XrvxRu1DYs6rv0H9D4UODXHPxJ3AsltPfByKMVdxjDXXB7zP5gK4_ncKeWM8VbOGoYygNQjyWA1k08KyiSWQlQ6SrZ31I_-20TDwWXqa0z",
          "token_type": "Bearer",
          "expires_in": 3600,
          "refresh_token": "1/dre0pehSvs5HMyEtH6WyOuqrUP57X6FRlJOWp9WHJGh7zpQQGqqpJXpbII_MjSE6"
        }
      }

      it('Should forward queries', () => {
        return db.runQuery(configs.googlesheets, '{}', [], options, user)
          .then((result) => {
            console.log('####', result)
            expect(result).to.not.be.null
          })
          .catch((err) => {
            console.log('EEEERRR')
          })
      })
    })
  })
})
