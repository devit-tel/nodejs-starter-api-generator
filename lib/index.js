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

  u.initProject(destinationPath, tagVersion)
  await u.updateConfigFile(packageName, destinationPath, yes)

  console.log(chalk.green('Generate project successfully!'))
}
