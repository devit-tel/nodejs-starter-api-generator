const { isEmpty } = require('lodash')

exports.initProject = require('./initProject')

exports.formatPackageName = v =>
  v.replace(/[` ~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '-')

exports.notEmpty = v => !isEmpty(v)
