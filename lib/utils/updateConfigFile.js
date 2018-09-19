const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')
const q = require('../questions')

_.templateSettings.interpolate = /<%=([\s\S]+?)%>/g

module.exports = async (packageName, destinationPath, yes) => {
  const defaultDeploymentVar = {
    registryName: packageName,
    projectRepoName: packageName,
    helmProductionName: `prod-th-${packageName}`,
    nameOverride: `prod-th-${packageName}`,
    defaultPortHttp: `prod-th-${packageName}-http`,
  }
  const DeploymentVarStaging = {
    registryName: packageName,
    projectRepoName: packageName,
    helmProductionName: `staging-th-${packageName}`,
    nameOverride: `staging-th-${packageName}`,
    defaultPortHttp: `staging-th-${packageName}-http`,
  }
  const DeploymentVarDevelopment = {
    registryName: packageName,
    projectRepoName: packageName,
    helmProductionName: `dev-th-${packageName}`,
    nameOverride: `dev-th-${packageName}`,
    defaultPortHttp: `dev-th-${packageName}-http`,
  }
  const deploymentVar = yes
    ? defaultDeploymentVar
    : await q.getDeploymentVar(defaultDeploymentVar)

  const [packageJson, gitlabCiYml, productionThYaml] = await Promise.all([
    fs.readFile(path.join(destinationPath, 'package.json')),
    fs.readFile(path.join(destinationPath, '.gitlab-ci.yml')),
    fs.readFile(
      path.join(destinationPath, 'deployment', 'values-production-th.yaml'),
    ),
  ])

  await Promise.all([
    fs.writeFile(
      path.join(destinationPath, 'package.json'),
      _.template(packageJson.toString())({ packageName }),
    ),
    fs.writeFile(
      path.join(destinationPath, '.gitlab-ci.yml'),
      _.template(gitlabCiYml.toString())(deploymentVar),
    ),
    fs.writeFile(
      path.join(destinationPath, 'deployment', 'values-production-th.yaml'),
      _.template(productionThYaml.toString())(deploymentVar),
    ),
    fs.writeFile(
      path.join(destinationPath, 'deployment', 'values-staging-th.yaml'),
      _.template(productionThYaml.toString())(DeploymentVarStaging),
    ),
    fs.writeFile(
      path.join(destinationPath, 'deployment', 'values-development-th.yaml'),
      _.template(productionThYaml.toString())(DeploymentVarDevelopment),
    ),
  ])
}
