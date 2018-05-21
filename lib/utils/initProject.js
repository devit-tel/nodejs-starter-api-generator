const fs = require('fs-extra')
const path = require('path')
const { execSync } = require('child_process')
const c = require('../config')

module.exports = (destinationPath, tagVersion) => {
  console.info('Creating destination directory ...')
  fs.mkdirSync(destinationPath)
  console.info('Creating destination directory successful')
  console.info(`Cloning ${c.sourceRepo} into ${destinationPath} ...`)
  execSync(
    `git clone --branch ${tagVersion} ${c.sourceRepo} ${destinationPath}`,
  )
  console.info('Cloning sucessful')
  console.info('Deleting .git ...')
  fs.removeSync(path.join(destinationPath, '.git'))
  console.info('Deleting .git successful')
}
