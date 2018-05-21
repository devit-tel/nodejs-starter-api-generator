const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync

String.prototype.replaceAll = function(search, replacement) {
  var target = this
  return target.split(search).join(replacement)
}

const releaseTagPrivate = ['v1.0.1']
const releaseTagPublic = []

const main = async () => {
  const currentPath = process.cwd()
  let templateDirectory = undefined

  const notEmpty = v => {
    if (!v.trim()) {
      return false
    }
    return true
  }

  const readFileAndReplace = (path, search, newWord) => {
    const content = fs.readFileSync(path, 'utf8')
    const newContent = content.replaceAll(search, newWord)
    fs.writeFileSync(path, newContent)
  }
  const checkOutTag = (repo, tag) => {
    return Git.Reference.dwim(repo, 'refs/tags/' + tag)
      .then(function(ref) {
        return ref.peel(Git.Object.TYPE.COMMIT)
      })
      .then(function(ref) {
        return repo.getCommit(ref)
      })
      .then(function(commit) {
        return Git.Checkout.tree(repo, commit, {
          checkoutStrategy: Git.Checkout.STRATEGY.SAFE,
        }).then(function() {
          return repo.setHeadDetached(
            commit,
            repo.defaultSignature,
            'Checkout: HEAD ' + commit.id(),
          )
        })
      })
  }
  const deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file, index) {
        var curPath = path + '/' + file
        if (fs.lstatSync(curPath).isDirectory()) {
          // recurse
          deleteFolderRecursive(curPath)
        } else {
          // delete file
          fs.unlinkSync(curPath)
        }
      })
      fs.rmdirSync(path)
    }
  }
  const questionsSectionOne = [
    {
      name: 'projectName',
      type: 'input',
      message: 'Project name:',
      validate: notEmpty,
    },
    {
      name: 'projectVersion',
      type: 'input',
      message: 'Project Version:',
      default: '1.0.0',
      validate: notEmpty,
    },
  ]
  const { projectName, projectVersion } = await inquirer.prompt(
    questionsSectionOne,
  )
  const defaultPackageName = projectName.replace(
    /[` ~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
    '-',
  )
  const questionsSectionTwo = [
    {
      name: 'packageName',
      type: 'input',
      message: 'Package name (name field inside package.json):',
      default: defaultPackageName,
      validate: notEmpty,
    },
    {
      name: 'destinationPath',
      type: 'input',
      message: 'Destination Path:',
      default: path.join(currentPath, defaultPackageName),
      validate: notEmpty,
    },
  ]
  const { packageName, destinationPath } = await inquirer.prompt(
    questionsSectionTwo,
  )
  const questionsRemoteRepoOfTemplate = [
    {
      name: 'gitSource',
      type: 'list',
      message: `Git template repository(If you're sendit developer should select 'Private')`,
      choices: ['Private', 'Public'],
      validate: notEmpty,
    },
  ]
  const { gitSource } = await inquirer.prompt(questionsRemoteRepoOfTemplate)
  let questionForTagVersion = undefined
  let sourceRepo = undefined
  if (gitSource === 'Private') {
    sourceRepo = 'https://gitlab.com/sendit-th/nodejs-starter.git'
    questionForTagVersion = [
      {
        name: 'tagVersion',
        type: 'list',
        message: `Please select version of template`,
        choices: releaseTagPrivate,
        validate: notEmpty,
      },
    ]
  } else {
    console.log('Public Repo is coming')
    process.exit(1)
  }
  const { tagVersion } = await inquirer.prompt(questionForTagVersion)
  let deploymentVar = undefined
  if (gitSource === 'Private' && tagVersion === 'v1.0.1') {
    const questionForDeploymentVar = [
      {
        name: 'registryName',
        type: 'input',
        message: `Registry name $ registry.dev.sendit.asia/sendit/`,
        validate: notEmpty,
        default: packageName,
      },
      {
        name: 'projectRepoName',
        type: 'input',
        message: `Project repo name $ tags@sendit-th/`,
        validate: notEmpty,
        default: packageName,
      },
      {
        name: 'helmProductionName',
        type: 'input',
        message: `Helm production name $ helm upgrade -i `,
        validate: notEmpty,
        default: `prod-th-${packageName}`,
      },
      {
        name: 'nameOverride',
        type: 'input',
        message: `Name override $ nameOverride: `,
        validate: notEmpty,
        default: `prod-th-${packageName}`,
      },
      {
        name: 'defaultPortHttpName',
        type: 'input',
        message: `Default port http name $ - name: `,
        validate: notEmpty,
        default: `prod-th-${packageName}-http`,
      },
    ]
    deploymentVar = await inquirer.prompt(questionForDeploymentVar)
  }
  console.info('Creating destination directory ...')
  if (fs.existsSync(destinationPath)) {
    const { isDelete } = await inquirer.prompt([
      {
        name: 'isDelete',
        type: 'confirm',
        message:
          'Your destination path is not empty. Do you want to delete it ?',
      },
    ])
    if (isDelete) {
      deleteFolderRecursive(destinationPath)
    } else {
      process.exit(1)
    }
  }
  fs.mkdirSync(destinationPath)
  console.info('Creating destination directory successful')
  console.info(`Cloning ${sourceRepo} into ${destinationPath} ...`)
  execSync(`git clone --branch ${tagVersion} ${sourceRepo} ${destinationPath}`)
  console.info(`Cloning sucessful`)
  console.info(`Deleting .git ...`)
  deleteFolderRecursive(path.join(destinationPath, '.git'))
  console.info(`Deleting .git successful`)

  let fileContentOfPackage = fs
    .readFileSync(path.join(destinationPath, 'package.json'), 'utf8')
    .toString()
  fileContentOfPackage = fileContentOfPackage.replaceAll(
    '<%package-name%>',
    packageName,
  )
  console.info(
    `Replaced <%package-name%> with ${packageName} inside package.json`,
  )

  let fileContentOfgitlab = fs
    .readFileSync(path.join(destinationPath, '.gitlab-ci.yml'), 'utf8')
    .toString()

  fileContentOfgitlab = fileContentOfgitlab.replaceAll(
    '<$registry-name$>',
    deploymentVar.registryName,
  )
  console.info(
    `Replaced <$registry-name$> with ${
      deploymentVar.registryName
    } inside .gitlab-ci.yml`,
  )
  fileContentOfgitlab = fileContentOfgitlab.replaceAll(
    '<$project-repo-name$>',
    deploymentVar.projectRepoName,
  )
  console.info(
    `Replaced <$project-repo-name$> with ${
      deploymentVar.projectRepoName
    } indside .gitlab-ci.yml`,
  )
  fileContentOfgitlab = fileContentOfgitlab.replaceAll(
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

  fileContentOfvalueProduction = fileContentOfvalueProduction.replaceAll(
    '<$name-override$>',
    deploymentVar.nameOverride,
  )
  console.info(
    `Replaced <$name-override$> with ${
      deploymentVar.nameOverride
    } inside inside deployment/values-production-th.yaml`,
  )
  fileContentOfvalueProduction = fileContentOfvalueProduction.replaceAll(
    '<$registry-name$>',
    deploymentVar.registryName,
  )
  console.info(
    `Replaced <$registry-name$> with ${
      deploymentVar.registryName
    } inside inside deployment/values-production-th.yaml`,
  )
  fileContentOfvalueProduction = fileContentOfvalueProduction.replaceAll(
    '<$default-port-http$>',
    deploymentVar.defaultPortHttpName,
  )
  console.info(
    `Replaced <$default-port-http$> with ${
      deploymentVar.defaultPortHttpName
    } inside deployment/values-production-th.yaml`,
  )

  console.info(`Overwriting .gitlab-ci.yml ...`)
  fs.writeFileSync(
    path.join(destinationPath, '.gitlab-ci.yml'),
    fileContentOfgitlab,
  )
  console.info(`Overwriting .gitlab-ci.yml successful`)

  console.info(`Overwriting deployment/values-production-th.yaml ...`)
  fs.writeFileSync(
    path.join(destinationPath, 'deployment', 'values-production-th.yaml'),
    fileContentOfvalueProduction,
  )
  console.info(`Overwriting deployment/values-production-th.yaml successful`)

  console.info(`Overwriting package.json ...`)
  fs.writeFileSync(
    path.join(destinationPath, 'package.json'),
    fileContentOfPackage,
  )
  console.info(`Overwriting deployment/package.json successful`)

  console.info(`Done !`)
}

exports.default = main
