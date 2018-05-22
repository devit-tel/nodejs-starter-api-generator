const h = require('../helper')
const inquirer = require('inquirer')

module.exports = ({ packageName, destinationPath }) => {
  const questions = [
    {
      name: 'packageName',
      type: 'input',
      message: 'Package name (name field inside package.json):',
      default: packageName,
      validate: h.notEmpty,
    },
    {
      name: 'destinationPath',
      type: 'input',
      message: 'Destination Path:',
      default: destinationPath,
      validate: h.notEmpty,
    },
  ]
  return inquirer.prompt(questions)
}
