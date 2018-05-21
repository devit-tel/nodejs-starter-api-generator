const h = require('../helper')
const path = require('path')
const inquirer = require('inquirer')

module.exports = projectName => {
  const currentPath = process.cwd()
  const defaultPackageName = h.formatPackageName(projectName)
  const questions = [
    {
      name: 'packageName',
      type: 'input',
      message: 'Package name (name field inside package.json):',
      default: defaultPackageName,
      validate: h.notEmpty,
    },
    {
      name: 'destinationPath',
      type: 'input',
      message: 'Destination Path:',
      default: path.join(currentPath, defaultPackageName),
      validate: h.notEmpty,
    },
  ]
  return inquirer.prompt(questions)
}
