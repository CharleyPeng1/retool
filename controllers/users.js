/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

require('dotenv').config()

const GoogleAuth = require('google-auth-library')
var bcrypt = require('bcryptjs')

const { User, Organization } = require('../models')
const auth = require('../modules/auth.js')

const googleAuth = new GoogleAuth()
const CLIENT_ID = '716367306867-d861tjqj92gjb0uphcjt8gu2nvtf6e9t.apps.googleusercontent.com'
const client = new googleAuth.OAuth2(CLIENT_ID, '', '')
const SALT_ROUNDS = 12

const login = (req, res) => {
  if (process.env.RESTRICTED_DOMAIN) {
    return res.status(422).send({
      error: true,
      message: 'Login via email & password is disabled',
    })
  }
  const { email, password, firstName, lastName } = req.body

  User.findOne({ where: {email: email} }).then(user => {
    if (user) {
      return bcrypt.compare(password, user.hashedPassword).then(match => {
        if (match) {
          user.getOrganization()
            .then(org => {
              const token = auth.generateToken({email, password})
              res.send({
                user,
                token,
                hostname: org.hostname,
                ownHostname: process.env.HOSTNAME,
              })
            })
        } else {
          res.status(422).json({
            error: true,
            message: 'Incorrect email or password.',
          })
        }
      }).catch(e => {
        res.status(422).json({
          error: true,
          message: 'Please login via Google.',
        })
      })
    } else {
      res.status(422).send({
        error: true,
        message: 'Incorrect email or password.'
      })
    }
  })
}

const signup = (req, res) => {
  const { email, password, firstName, lastName } = req.body

  if (process.env.RESTRICTED_DOMAIN) {
    return res.status(422).send({
      error: true,
      message: 'Signup via password is disabled',
    })
  }

  User.findOne({ where: {email: email} }).then(user => {
    if (!user) {
      return Organization.findOrCreate({
        where: {
          domain: null,
          name: email,
        },
      }).spread(org => {
        return bcrypt.hash(password, SALT_ROUNDS)
          .then(hashedPassword => {
            const token = auth.generateToken({email, password})
            User.create({
              firstName,
              lastName,
              email,
              hashedPassword,
              organization_id: org.get('id'),
            })
              .then(user => res.status(201).send({
                user,
                token,
                ownHostname: process.env.HOSTNAME,
              }))
              .catch(error => res.status(400).send(error))
          })
      })
    } else {
      res.status(422).send({
        error: true,
        message: 'An account with that email address already exists.'
      })
    }
  })
}

const loginViaGoogle = (req, res) => {
  const googleToken = req.query.token
  client.verifyIdToken(googleToken, CLIENT_ID, (e, login) => {
    if (e) {
      return res.status(404).json({
        error: true,
        message: 'Could not authenticate.',
      })
    } else {
      const payload = login.getPayload()
      const email = payload.email
      User.findOne({ where: {email: email} }).then(user => {
        if (user) {
          user.getOrganization()
            .then(org => {
              const token = auth.generateToken({email})
              res.send({
                user,
                token,
                hostname: org.hostname,
                ownHostname: process.env.HOSTNAME,
              })
            })
        } else {
          const token = auth.generateToken({email})
          const name = payload.hd ? payload.hd : payload.email
          if (process.env.RESTRICTED_DOMAIN) {
            if (payload.hd !== process.env.RESTRICTED_DOMAIN) {
              return res.status(422).send({
                error: true,
                message: `Cannot login from domain ${payload.hd} not allowed.`,
              })
            }
          }
          return Organization.findOrCreate({
            where: {
              domain: payload.hd,
              name,
            },
          }).spread(org => {
            User
              .create({
                email,
                organization_id: org.get('id'),
                firstName: payload.given_name,
                lastName: payload.family_name,
                profilePhotoUrl: payload.picture,
                googleId: payload.sub,
                googleToken: googleToken,
              })
              .then(user => res.status(201).send({
                user,
                token,
                hostname: org.hostname,
                ownHostname: process.env.HOSTNAME,
              }))
              .catch(error => res.status(400).send(error))
          })
        }
      })
    }
  })
}

module.exports = {
  login,
  signup,
  loginViaGoogle,
}
