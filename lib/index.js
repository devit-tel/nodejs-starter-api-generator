const fs = require('fs-extra')
const path = require('path')
const { template } = require('lodash')
const chalk = require('chalk')
const q = require('./questions')
const u = require('./utils')

module.exports = async projectName => {
  const {
    packageName,
    destinationPath,
  } = await q.getPackageNameAndDestinationPath(projectName)

  if (fs.existsSync(destinationPath)) {
    const { isDelete } = await q.getIsDelete()
    if (isDelete) {
      fs.removeSync(destinationPath)
    } else {
      process.exit(1)
    }
  }

  const { gitSource } = await q.getGitSource()

  if (gitSource === 'Public') {
    console.log(chalk.red('Public Repo is coming...'))
    process.exit(1)
  }

  const { tagVersion } = await q.getTagVersion()

  let deploymentVar
  if (gitSource === 'Private' && tagVersion === 'v1.0.1') {
    deploymentVar = await q.getDeploymentVar(packageName)
  }

  console.log(chalk.green('Initializing project.'))
  u.initProject(destinationPath, tagVersion)

  console.log(chalk.green('Setup config file.'))
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
      template(packageJson.toString())({ packageName }),
    ),
    fs.writeFile(
      path.join(destinationPath, '.gitlab-ci.yml'),
      template(gitlabCiYml.toString())(deploymentVar),
    ),
    fs.writeFile(
      path.join(destinationPath, 'deployment', 'values-production-th.yaml'),
      template(productionThYaml.toString())(deploymentVar),
    ),
  ])
  console.log(chalk.green('Generate project successfuly!'))
}
