/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

const _ = require('lodash')
const request = require('request')

const { Resource } = require('../models')
const db = require('../db/db.js')
const records = require('../common/records.js')

const getResources = (req, res) => {
  req.user.getOrganization()
    .then(org => org.getResources({
      order: [['createdAt', 'asc']],
    }))
    .then(resources => res.send({resources}))
    .catch(error => res.send({error: error.message}))
}

const getSchema = (req, res) => {
  const resourceName = req.params.id

  req.user.getOrganization({
    include: [{model: Resource, as: 'resources', where: {name: resourceName}}],
  })
    .then((org) => {
      const resource = _.find(org.resources, { name: resourceName })
      return db.getSchema(resource.dataValues)
    })
    .then((schema) => {
      res.send({ schema, resourceName })
    })
    .catch(error => {
      res.status(422).send({error: error.message})
    })
}

const createResource = (req, res) => {
  const params = _.pick(req.body, [
    'name', 'type', 'host', 'port', 'databaseName',
    'databaseUsername', 'databasePassword',
  ])
  // Test to make sure the resource is valid.
  db.testConnection(params, req.user)
    .then((result) => {
      return req.user.getOrganization()
    })
    .then(org => {
      params.organization_id = org.id
      return Resource.create(params)
    })
    .then(resource => {
      res.send(resource)
    })
    .catch(error => {
      res.status(422).send({error: error.message})
    })
}

const patchResource = (req, res) => {
  const params = _.pick(req.body, [
    'name', 'type', 'host', 'port', 'databaseName',
    'databaseUsername', 'databasePassword', 'id',
  ])
  req.user.getOrganization({
    include: [{model: Resource, as: 'resources', where: {id: params.id}, limit: 1}],
  })
    .then(org => {
      const resource = org.resources[0]
      if (params.databasePassword === '') {
        delete params.databasePassword
      }
      resource.set(params)
      return db.testConnection(resource.dataValues, req.user).then(() => resource)
    })
    .then(resource => resource.save())
    .then(resource => res.send(resource))
    .catch(error => res.status(422).send({error: error.message}))
}

const proxy = (req, res) => {
  var url = req.header('internal-proxy-url')
  req.pipe(request(url)).pipe(res)
}

const runSqlQuery = (req, res) => {
  const { pageName } = req.params
  let organization

  console.log('\n=====================\n  Processing: ', req.query, '\n=====================')

  req.user.getOrganization({
    include: [{model: Resource, as: 'resources'}],
  })
    .then(org => {
      organization = org
      return org.getPages({ where: { name: pageName } })
    })
    .then(pages => {
      return pages[0].getSaves({ order: [['createdAt', 'desc']] })
    })
    .then(saves => {
      const save = saves[0]
      const appState = records.recordTransit.fromJSON(save.data.appState)
      const query = appState.getIn(['plugins', req.query.queryName, 'template', 'query'])
      const resourceName = appState.getIn(['plugins', req.query.queryName, 'resourceName'])
      const resource = _.find(organization.resources, {name: resourceName})

      const params = req.body.parameters
      const options = req.body.options

      dispatchQuery(req, res, resource.dataValues, query, params, options)
    })
    .catch(error => {
      res.status(400).send({error: error.message})
    })
}

const preview = (req, res) => {
  // Only should run if in development mode
  const resourceName = req.query.resourceName

  req.user.getOrganization({
    include: [{model: Resource, as: 'resources', where: {name: resourceName}}],
  })
    .then(org => {
      const query = req.query.query
      const params = req.body.parameters
      const options = req.body.options
      console.log(options)
      const resource = org.resources[0]

      dispatchQuery(req, res, resource.dataValues, query, params, options)
    })
}

function dispatchQuery (req, res, resource, query, params, options) {
  db.runQuery(resource, query, params, options, req.user.dataValues)
    .then((result) => {
      res.send(result)
      res.end()
    })
    .catch((err) => {
      const errorMessage = err.stack.split('\n')[0]
      res.status(400).send({ error: {
        message: errorMessage,
        code: err.code,
      }})
      res.end()
    })
}

module.exports = {
  proxy,
  preview,
  runSqlQuery,
  createResource,
  getResources,
  patchResource,
  getSchema,
}
