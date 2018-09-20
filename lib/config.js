module.exports = {
  sourceRepoPub: 'https://github.com/spksoft/nodejs-starter-template.git',
  sourceRepo: 'https://gitlab.com/sendit-th/nodejs-starter.git',
  releaseTagPrivate: ['v1.1.2-private', 'v1.1.0-private', 'v1.0.4-private', 'v1.0.3-private', 'v1.0.2'],
  releaseTagPublic: ['v1.0.1', 'v1.0.0'],
  defaultAnswerPub: {
    isDelete: true,
    gitSource: 'Public',
    tagVersionn: 'v1.0.1',
  },
  defaultAnswer: {
    isDelete: true,
    gitSource: 'Private',
    tagVersionn: 'v1.0.4-private',
  },
}
