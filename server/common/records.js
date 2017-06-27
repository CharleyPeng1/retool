/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

const Immutable = require('immutable')
const { Record } = Immutable
const transit = require('transit-immutable-js')

const Position = new Record({
  x: 0,
  y: 0,
  height: 0,
  width: 0,
}, 'position')

const Saves = new Record({
  isFetching: false,
  saves: new Immutable.List(),
})

const PluginTemplate = new Record({
  id: undefined,
  type: undefined,
  subtype: undefined,
  resourceName: undefined,
  template: undefined,
  position: undefined,
  tabIndex: undefined,
  container: '',
}, 'pluginTemplate')
PluginTemplate.prototype.isWidget = function () {
  return this.type === 'widget'
}

const AppTemplate = new Record({
  datasourceCount: 0,                   // For generating query ids
  widgetCount: 0,                         // For generating query ids
  isFetching: false,                     // when loading for first time, or restoring
  plugins: new Immutable.OrderedMap(),   // keyed plugins
  saves: new Saves(),
  height: 0,
  heightHeap: [],
  createdAt: null,
}, 'appTemplate')

const recordTransit = transit.withRecords([Position, PluginTemplate, AppTemplate])

module.exports = {
  Position,
  Saves,
  PluginTemplate,
  AppTemplate,
  recordTransit,
}
