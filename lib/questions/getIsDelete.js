const inquirer = require('inquirer')

module.exports = () =>
  inquirer.prompt([
    {
      name: 'isDelete',
      type: 'confirm',
      message: 'Your destination path is not empty. Do you want to delete it ?',
    },
  ])
