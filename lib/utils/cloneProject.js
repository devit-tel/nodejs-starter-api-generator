const fs = require('fs-extra')
const path = require('path')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const c = require('../config')

module.exports = async (destinationPath, tagVersion) => {
  await exec(
    `git clone --branch ${tagVersion} ${c.sourceRepo} ${destinationPath}`,
    { stdio: 'ignore' },
  )
  await fs.remove(path.join(destinationPath, '.git'))
}
