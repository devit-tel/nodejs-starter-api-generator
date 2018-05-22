const fs = require('fs-extra')
const path = require('path')
const { exec } = require('child_process')
const c = require('../config')

module.exports = async (destinationPath, tagVersion) => {
  await exec(
    `git clone --branch ${tagVersion} ${c.sourceRepo} ${destinationPath}`,
    { stdio: 'ignore' },
  )
  await fs.remove(path.join(destinationPath, '.git'))
}
