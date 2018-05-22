const fs = require('fs-extra')
const path = require('path')
const { execSync } = require('child_process')
const chalk = require('chalk')
const c = require('../config')

module.exports = (destinationPath, tagVersion) => {
  fs.mkdirSync(destinationPath)
  console.log(chalk.blue(`Cloning ${c.sourceRepo} into ${destinationPath}...`))
  execSync(
    `git clone --branch ${tagVersion} ${c.sourceRepo} ${destinationPath}`,
    { stdio: 'ignore' },
  )
  fs.removeSync(path.join(destinationPath, '.git'))
}
