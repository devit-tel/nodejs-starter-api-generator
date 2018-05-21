const { isEmpty } = require('lodash')

exports.formatPackageName = v =>
  v.replace(/[` ~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '-')

exports.notEmpty = v => !isEmpty(v)
