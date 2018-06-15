const chalk = require('chalk')
const c = require('../config')
const q = require('../questions')

module.exports = async yes => {
  const { gitSource } = yes ? c.defaultAnswer : await q.getGitSource()

  // if (gitSource === 'Public') {
  //   console.log(chalk.red('Public Repo is coming...'))
  //   process.exit(1)
  // }
  const { tagVersion } = yes ? (gitSource === 'Public') ? c.defaultAnswerPub : c.defaultAnswer : await q.getTagVersion(gitSource)
  
  return { tagVersion, gitSource }
}
