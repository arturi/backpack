const chalk = require('chalk')

module.exports = Backpack

function Backpack (opts) {
  const defaultOpts = {
    verbose: true,
    dir: 'content'
  }

  this.opts = Object.assign({}, defaultOpts, opts)
  this.documents = []

  this.log(chalk.magenta(`Generating: ${chalk.underline(opts.envName)}`))
}

Backpack.prototype.use = function (plugin, opts) {
  plugin(this, opts)
  return this
}

Backpack.prototype.log = function (msg, opts) {
  const pad = (str) => (str.length !== 2) ? '0' + str : str

  var date = new Date()
  var hours = date.getHours().toString()
  var minutes = date.getMinutes().toString()
  var seconds = date.getSeconds().toString()
  var time = pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)

  var resultingMsg = `[${time}] ${msg}`
  console.log(resultingMsg)
}
