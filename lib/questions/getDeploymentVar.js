const inquirer = require('inquirer')
const h = require('../helper')

module.exports = packageName =>
  inquirer.prompt([
    {
      name: 'registryName',
      type: 'input',
      message: 'Registry name $ registry.dev.sendit.asia/sendit/',
      validate: h.notEmpty,
      default: packageName,
    },
    {
      name: 'projectRepoName',
      type: 'input',
      message: 'Project repo name $ tags@sendit-th/',
      validate: h.notEmpty,
      default: packageName,
    },
    {
      name: 'helmProductionName',
      type: 'input',
      message: 'Helm production name $ helm upgrade -i ',
      validate: h.notEmpty,
      default: `prod-th-${packageName}`,
    },
    {
      name: 'nameOverride',
      type: 'input',
      message: 'Name override $ nameOverride: ',
      validate: h.notEmpty,
      default: `prod-th-${packageName}`,
    },
    {
      name: 'defaultPortHttp',
      type: 'input',
      message: 'Default port http name $ - name: ',
      validate: h.notEmpty,
      default: `prod-th-${packageName}-http`,
    },
  ])
