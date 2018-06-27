const chalk = require('chalk')
const u = require('./utils')
const c = require('./config')

module.exports = async (projectName, yes) => {
  console.log(chalk.green('Prepare directory...'))
  const { packageName, destinationPath } = await u.prepareDirectory(
    projectName,
    yes,
  )
  const { tagVersion, gitSource } = await u.configGit(yes)
  const sourceRepo = (gitSource !== 'Public') ? c.sourceRepoPub : c.sourceRepo
  console.log(chalk.blue(`Cloning ${sourceRepo} into ${destinationPath}...`))
  await u.cloneProject(destinationPath, tagVersion, gitSource)

  if (gitSource !== 'Public') {
    console.log(chalk.green('Updating configuration file...'))
    await u.updateConfigFile(packageName, destinationPath, yes)
  }

  console.log(chalk.green('Generate project successfully!'))
}
