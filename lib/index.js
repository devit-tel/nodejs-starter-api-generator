const chalk = require('chalk')
const q = require('./questions')
const u = require('./utils')
const c = require('./config')

module.exports = async (projectName, yes) => {
  console.log(chalk.green('Prepare directory...'))
  const { packageName, destinationPath } = await u.prepareDirectory()
  const { gitSource } = yes ? c.defaultAnswer : await q.getGitSource()

  if (gitSource === 'Public') {
    console.log(chalk.red('Public Repo is coming...'))
    process.exit(1)
  }

  const { tagVersion } = yes ? c.defaultAnswer : await q.getTagVersion()

  console.log(chalk.blue(`Cloning ${c.sourceRepo} into ${destinationPath}...`))
  await u.cloneProject(destinationPath, tagVersion)

  console.log(chalk.green('Updating configuration file...'))
  await u.updateConfigFile(packageName, destinationPath, yes)

  console.log(chalk.green('Generate project successfully!'))
}
