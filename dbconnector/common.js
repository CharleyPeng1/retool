/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

const dataTypeMap = {
  'character varying': 'varchar',
  'timestamp with time zone': 'timezone',
  'timestamp without time zone': 'timezone',
  'double precision': 'double',
}

const formatDataType = (dataType) => dataTypeMap[dataType] ? dataTypeMap[dataType] : dataType

function formatSchema (rows) {
  let res = {}
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    if (!res[row.table_name]) {
      res[row.table_name] = {}
    }

    res[row.table_name][row.column_name] = {
      data_type: formatDataType(row.data_type),
    }
  }
  return res
}

function keyByColumn (fields, rows) {
  let res = {}
  fields.forEach((field) => { res[field.name] = [] })

  for (let i = 0; i < rows.length; i++) {
    fields.forEach((field) => {
      res[field.name][i] = rows[i][field.name]
    })
  }
  return res
}

const templateRegex = /{{([\s\S]+?)}}/g
const objectRegex = /^{{([\s\S]+?)}}$/g

module.exports = {
  keyByColumn,
  formatSchema,
  templateRegex,
  objectRegex,
}
