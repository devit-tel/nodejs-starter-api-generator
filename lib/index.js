const fs = require('fs-extra')
const path = require('path')
const { replace } = require('lodash')
const q = require('./questions')
const u = require('./utils')

module.exports = async projectName => {
  const {
    packageName,
    destinationPath,
  } = await q.getPackageNameAndDestinationPath(projectName)

  if (fs.existsSync(destinationPath)) {
    const { isDelete } = await q.getIsDelete()
    if (isDelete) {
      fs.removeSync(destinationPath)
    } else {
      process.exit(1)
    }
  }

  const { gitSource } = await q.getGitSource()

  if (gitSource === 'Public') {
    console.log('Public Repo is coming')
    process.exit(1)
  }

  const { tagVersion } = await q.getTagVersion()

  let deploymentVar
  if (gitSource === 'Private' && tagVersion === 'v1.0.1') {
    deploymentVar = await q.getDeploymentVar(packageName)
  }

  u.initProject(destinationPath, tagVersion)

  let fileContentOfPackage = fs
    .readFileSync(path.join(destinationPath, 'package.json'), 'utf8')
    .toString()
  fileContentOfPackage = replace(
    fileContentOfPackage,
    '<%package-name%>',
    packageName,
  )
  console.info(
    `Replaced <%package-name%> with ${packageName} inside package.json`,
  )

  let fileContentOfgitlab = fs
    .readFileSync(path.join(destinationPath, '.gitlab-ci.yml'), 'utf8')
    .toString()

  fileContentOfgitlab = replace(
    fileContentOfgitlab,
    '<$registry-name$>',
    deploymentVar.registryName,
  )
  console.info(
    `Replaced <$registry-name$> with ${
      deploymentVar.registryName
    } inside .gitlab-ci.yml`,
  )
  fileContentOfgitlab = replace(
    fileContentOfgitlab,
    '<$project-repo-name$>',
    deploymentVar.projectRepoName,
  )
  console.info(
    `Replaced <$project-repo-name$> with ${
      deploymentVar.projectRepoName
    } indside .gitlab-ci.yml`,
  )
  fileContentOfgitlab = replace(
    fileContentOfgitlab,
    '<$helm-production-name$>',
    deploymentVar.helmProductionName,
  )
  console.info(
    `Replaced <$helm-production-name$> with ${
      deploymentVar.helmProductionName
    } inside .gitlab-ci.yml`,
  )

  let fileContentOfvalueProduction = fs.readFileSync(
    path.join(destinationPath, 'deployment', 'values-production-th.yaml'),
    'utf8',
  )

  fileContentOfvalueProduction = replace(
    fileContentOfvalueProduction,
    '<$name-override$>',
    deploymentVar.nameOverride,
  )
  console.info(
    `Replaced <$name-override$> with ${
      deploymentVar.nameOverride
    } inside inside deployment/values-production-th.yaml`,
  )
  fileContentOfvalueProduction = replace(
    fileContentOfvalueProduction,
    '<$registry-name$>',
    deploymentVar.registryName,
  )
  console.info(
    `Replaced <$registry-name$> with ${
      deploymentVar.registryName
    } inside inside deployment/values-production-th.yaml`,
  )
  fileContentOfvalueProduction = replace(
    fileContentOfvalueProduction,
    '<$default-port-http$>',
    deploymentVar.defaultPortHttpName,
  )
  console.info(
    `Replaced <$default-port-http$> with ${
      deploymentVar.defaultPortHttpName
    } inside deployment/values-production-th.yaml`,
  )

  console.info('Overwriting .gitlab-ci.yml ...')
  fs.writeFileSync(
    path.join(destinationPath, '.gitlab-ci.yml'),
    fileContentOfgitlab,
  )
  console.info('Overwriting .gitlab-ci.yml successful')

  console.info('Overwriting deployment/values-production-th.yaml ...')
  fs.writeFileSync(
    path.join(destinationPath, 'deployment', 'values-production-th.yaml'),
    fileContentOfvalueProduction,
  )
  console.info('Overwriting deployment/values-production-th.yaml successful')

  console.info('Overwriting package.json ...')
  fs.writeFileSync(
    path.join(destinationPath, 'package.json'),
    fileContentOfPackage,
  )
  console.info('Overwriting deployment/package.json successful')

  console.info('Done !')
}
