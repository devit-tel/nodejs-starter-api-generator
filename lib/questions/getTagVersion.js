const inquirer = require('inquirer')
const c = require('../config')
const u = require('../utils')

module.exports = (gitSource) =>
  inquirer.prompt([
    {
      name: 'tagVersion',
      type: 'list',
      message: 'Please select version of template',
      choices: (gitSource === 'Public') ? c.releaseTagPublic : c.releaseTagPrivate,
      validate: u.notEmpty,
    },
  ])
