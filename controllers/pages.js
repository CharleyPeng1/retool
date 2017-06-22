/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

const { Page, PageSave } = require('../models')

/**
 * Returns the list of pages that have been created in the past.
 */
const pageIndex = (req, res) => {
  req.user.getOrganization()
  .then(org => {
    org.getPages({order: [['createdAt', 'desc']]}).then(pages => {
      res.send({ pages })
    })
  })
}

/**
 * Returns the latest page for the page specified
 */
const getPage = (req, res) => {
  const { pageName } = req.params
  req.user.getOrganization()
    .then(org => {
      return org.getPages({ where: { name: pageName } })
    })
    .then(pages => {
      return pages[0].getSaves({ order: [['createdAt', 'desc']] })
    })
    .then(saves => {
      res.send({ page: saves[0] })
    })
    .catch(error => {
      res.status(422).send({error})
    })
}

const savePage = (req, res) => {
  const { pageName } = req.params
  let organizationId
  req.user.getOrganization()
    .then(org => {
      organizationId = org.id
      return org.getPages({ where: { name: pageName } })
    })
    .then(pages => {
      if (pages.length === 0) {
        Page.create({
          name: pageName,
          organization_id: organizationId,
        })
          .then(page => {
            PageSave.create({
              data: req.body,
              page_id: page.id,
            }).then(save => res.send({save}))
          })
      } else {
        PageSave.create({
          data: req.body,
          page_id: pages[0].id,
        }).then(save => res.send({save}))
      }
    })
}

const getSaves = (req, res) => {
  const { pageName } = req.params
  req.user.getOrganization()
    .then(org => {
      return org.getPages({ where: { name: pageName } })
    })
    .then(pages => {
      return pages[0].getSaves({ order: [['createdAt', 'desc']], attributes: ['id', 'createdAt'] })
    })
    .then(saves => {
      res.send({ saves })
    })
    .catch(error => {
      res.send({error})
    })
}

const loadSave = (req, res) => {
  const { pageName, saveId } = req.params
  req.user.getOrganization()
    .then(org => {
      return org.getPages({ where: { name: pageName } })
    })
    .then(pages => {
      return pages[0].getSaves({ where: { id:  saveId } })
    })
    .then(saves => {
      res.send({ page: saves[0] })
    })
    .catch(error => {
      res.send({error})
    })
}

module.exports = {
  pageIndex,
  getPage,
  savePage,
  getSaves,
  loadSave,
}
