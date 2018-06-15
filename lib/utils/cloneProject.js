const fs = require('fs-extra')
const path = require('path')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const c = require('../config')

module.exports = async (destinationPath, tagVersion, gitSource) => {
  await exec(
    `git clone --branch ${tagVersion} ${(gitSource === 'Public') ? c.sourceRepoPub : c.sourceRepo} ${destinationPath}`,
    { stdio: 'ignore' },
  )
  await fs.remove(path.join(destinationPath, '.git'))
}
