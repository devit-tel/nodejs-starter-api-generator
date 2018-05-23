const { isEmpty } = require('lodash')

exports.cloneProject = require('./cloneProject')
exports.updateConfigFile = require('./updateConfigFile')
exports.prepareDirectory = require('./prepareDirectory')
exports.configGit = require('./configGit')

exports.notEmpty = v => !isEmpty(v)
