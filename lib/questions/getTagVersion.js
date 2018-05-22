const inquirer = require('inquirer')
const c = require('../config')
const u = require('../utils')

module.exports = () =>
  inquirer.prompt([
    {
      name: 'tagVersion',
      type: 'list',
      message: 'Please select version of template',
      choices: c.releaseTagPrivate,
      validate: u.notEmpty,
    },
  ])
