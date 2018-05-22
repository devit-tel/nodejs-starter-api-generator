const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')
const chalk = require('chalk')
const q = require('./questions')
const u = require('./utils')
const c = require('./config')

_.templateSettings.interpolate = /<%=([\s\S]+?)%>/g

module.exports = async (projectName, yes) => {
  const defaultPackageName = u.formatPackageName(projectName)
  const defaultValues = {
    packageName: defaultPackageName,
    destinationPath: path.join(process.cwd(), defaultPackageName),
  }

  const { packageName, destinationPath } = yes
    ? defaultValues
    : await q.getPackageNameAndDestinationPath(defaultValues)

  if (fs.existsSync(destinationPath)) {
    const { isDelete } = yes ? c.defaultAnswer : await q.getIsDelete()
    if (isDelete) {
      fs.removeSync(destinationPath)
    } else {
      process.exit(1)
    }
  }

  const { gitSource } = yes ? c.defaultAnswer : await q.getGitSource()

  if (gitSource === 'Public') {
    console.log(chalk.red('Public Repo is coming...'))
    process.exit(1)
  }

  const { tagVersion } = yes ? c.defaultAnswer : await q.getTagVersion()

  const defaultDeploymentVar = {
    registryName: packageName,
    projectRepoName: packageName,
    helmProductionName: `prod-th-${packageName}`,
    nameOverride: `prod-th-${packageName}`,
    defaultPortHttp: `prod-th-${packageName}-http`,
  }
  const deploymentVar = yes
    ? defaultDeploymentVar
    : await q.getDeploymentVar(defaultDeploymentVar)

  u.initProject(destinationPath, tagVersion)

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
  ])
  console.log(chalk.green('Generate project successfully!'))
}
