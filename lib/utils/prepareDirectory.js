const fs = require('fs-extra')
const path = require('path')
const q = require('../questions')
const c = require('../config')

module.exports = async (projectName, yes) => {
  const defaultPackageName = projectName.replace(
    /[` ~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi,
    '-',
  )
  const defaultValues = {
    packageName: defaultPackageName,
    destinationPath: path.join(process.cwd(), defaultPackageName),
  }

  const { packageName, destinationPath } = yes
    ? defaultValues
    : await q.getPackageNameAndDestinationPath(defaultValues)

  const exists = await fs.pathExists(destinationPath)
  if (exists) {
    const { isDelete } = yes ? c.defaultAnswer : await q.getIsDelete()
    if (isDelete) {
      await fs.remove(destinationPath)
    } else {
      process.exit(1)
    }
  }
  await fs.mkdir(destinationPath)
  return { packageName, destinationPath }
}
