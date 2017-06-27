/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

const {
  organizations,
  pages,
  users,
  resources,
} = require('../controllers')

module.exports = (app) => {
  app.post('/api/login', users.login)
  app.post('/api/signup', users.signup)
  app.post('/api/oauthcallback', users.loginViaGoogle)

  app.get('/api/organization', organizations.getOrganization)

  app.use('/proxy', resources.proxy)
  app.post('/api/pages/:pageName/query', resources.runSqlQuery)
  app.get('/api/resources', resources.getResources)
  app.patch('/api/resources/:id', resources.patchResource)
  app.get('/api/resources/:id/schema', resources.getSchema)
  app.post('/api/resources', resources.createResource)
  app.post('/api/preview', resources.preview)

  app.get('/api/pages', pages.pageIndex)
  app.get('/api/pages/:pageName', pages.getPage)
  app.post('/api/pages/:pageName/save', pages.savePage)
  app.get('/api/saves/:pageName', pages.getSaves)
  app.get('/api/saves/:pageName/:saveId', pages.loadSave)
}
