const glob = require('glob')
const chalk = require('chalk')

module.exports = function backpackGetDocumentList (backpack, opts) {
  backpack.documentList = glob.sync(opts.pattern, { cwd: backpack.opts.dir })
  backpack.log(`Packing ${chalk.underline(backpack.documentList.length)} files into the backpack... 🤖`)
}
