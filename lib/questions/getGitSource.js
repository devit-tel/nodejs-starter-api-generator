const inquirer = require('inquirer')
const h = require('../helper')

module.exports = () =>
  inquirer.prompt([
    {
      name: 'gitSource',
      type: 'list',
      message:
        "Git template repository(If you're sendit developer should select 'Private')",
      choices: ['Private', 'Public'],
      validate: h.notEmpty,
    },
  ])
