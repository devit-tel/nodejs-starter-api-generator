const inquirer = require('inquirer')
const c = require('../config')
const h = require('../helper')

module.exports = () =>
  inquirer.prompt([
    {
      name: 'tagVersion',
      type: 'list',
      message: 'Please select version of template',
      choices: c.releaseTagPrivate,
      validate: h.notEmpty,
    },
  ])
