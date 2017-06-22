/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

const { User } = require('../models')

const getOrganization = (req, res) => {
  req.user.getOrganization({
    include: [{model: User, as: 'users'}],
  })
  .then(org => {
    res.send({ org })
  })
}

module.exports = {
  getOrganization,
}
