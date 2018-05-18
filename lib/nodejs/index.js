const inquirer = require('inquirer')
const fs = require('fs')
const os = require('os')
const path = require('path')

const main = async () => {
    const currentPath = process.cwd()
    const notEmpty = (v) => {
        if (!v.trim()) {
            return false
        }
        return true
    }
    const deleteFolderRecursive = function(path) {
        if (fs.existsSync(path)) {
          fs.readdirSync(path).forEach(function(file, index){
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
              deleteFolderRecursive(curPath);
            } else { // delete file
              fs.unlinkSync(curPath);
            }
          });
          fs.rmdirSync(path);
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
            default: "1.0.0",
            validate: notEmpty,
        },
    ]
    const { projectName, projectVersion } = await inquirer.prompt(questionsSectionOne)
    const defaultPackageName = projectName.replace(/[` ~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '-')
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
        }
    ]
    const { packageName } = await inquirer.prompt(questionsSectionTwo)
    const questionsLocalOrRemote = [
        {
            name: 'sourceOfTemplate',
            message: 'Source of template:',
            type: 'list',
            choices: [
                {
                    name: 'git',
                    value: 'git',
                },
                {
                    name: 'local (without deployment resources)',
                    value: 'local'
                }
            ]
        }
    ]
    const { sourceOfTemplate } = await inquirer.prompt(questionsLocalOrRemote)
    let templateDirectory = undefined
    if (sourceOfTemplate === 'git') {
        templateDirectory = path.join(os.tmpdir(), 'sendit-nodejs-template')
        if(fs.existsSync(templateDirectory)) {
            deleteFolderRecursive(templateDirectory)
        }
        fs.mkdirSync(templateDirectory)
    } else if (sourceOfTemplate === 'local') {

    }
    console.log(templateDirectory)
    // console.log(process.cwd())
    // console.log(__filename)
    // console.log(__dirname)
    // console.log(templateDirectory)
}

exports.default = main