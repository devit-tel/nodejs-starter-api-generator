const inquirer = require('inquirer')
const u = require('../utils')

module.exports = defaultDeploymentVar =>
  inquirer.prompt([
    {
      name: 'registryName',
      type: 'input',
      message: 'Registry name $ registry.dev.sendit.asia/sendit/',
      validate: u.notEmpty,
      default: defaultDeploymentVar.registryName,
    },
    {
      name: 'projectRepoName',
      type: 'input',
      message: 'Project repo name $ tags@sendit-th/',
      validate: u.notEmpty,
      default: defaultDeploymentVar.projectRepoName,
    },
    {
      name: 'helmProductionName',
      type: 'input',
      message: 'Helm production name $ helm upgrade -i ',
      validate: u.notEmpty,
      default: defaultDeploymentVar.helmProductionName,
    },
    {
      name: 'nameOverride',
      type: 'input',
      message: 'Name override $ nameOverride: ',
      validate: u.notEmpty,
      default: defaultDeploymentVar.nameOverride,
    },
    {
      name: 'defaultPortHttp',
      type: 'input',
      message: 'Default port http name $ - name: ',
      validate: u.notEmpty,
      default: defaultDeploymentVar.defaultPortHttp,
    },
  ])
