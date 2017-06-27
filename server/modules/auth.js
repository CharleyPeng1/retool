/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

require('dotenv').config()

const jwt = require('jsonwebtoken')
const { User } = require('../models')

const SECRET = process.env.JWT_SECRET

function generateToken (user) {
  var u = {
    email: user.email,
  }

  return jwt.sign(u, SECRET)
}

const authenticationMiddleware = function (req, res, next) {
  const return401OnError = !(
    req.path === '/api/login' ||
    req.path === '/api/signup' ||
    req.path === '/api/oauthcallback' ||
    req.path.slice(0, 4) !== '/api'
  )

  const token = req.header('Internal-Authorization')
  jwt.verify(token, SECRET, function (err, decoded) {
    if (err && return401OnError) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failure',
      })
    } else if (err && !return401OnError) {
      next()
    } else {
      User.findOne({ where: { email: decoded.email } }).then(user => {
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Authentication failure',
          })
        } else {
          req.user = user
          next()
        }
      })
    }
  })
}

module.exports = {
  authenticationMiddleware,
  generateToken,
}
