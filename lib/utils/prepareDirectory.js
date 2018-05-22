const fs = require('fs-extra')
const path = require('path')
const q = require('../questions')
const u = require('../utils')
const c = require('../config')

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
  return { packageName, destinationPath }
}
