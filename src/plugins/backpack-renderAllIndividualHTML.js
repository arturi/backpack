const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')

module.exports = function backpackRenderAllIndividualHTML (backpack, opts) {
  backpack.log(`Generating all docs in HTML...`)
  const collection = backpack[opts.collection] ? backpack[opts.collection] : backpack.documents

  collection.forEach((doc) => {
    const template = doc.template || opts.template

    if (!opts.templates[template]) {
      backpack.log(`failed to generate ${chalk.red(doc.slug)}, wrong template: ${template}`)
      return
    }

    const page = opts.templates[template]({
      doc: doc,
      backpack: backpack
    })

    const outPath = path.join(
      backpack.opts.out,
      backpack.opts.outPrefix,
      doc.disablePrettyUrl ? `${doc.slug}.html` : doc.slug,
      doc.disablePrettyUrl ? '' : 'index.html'
    )

    fs.outputFileSync(outPath, page)

    if (backpack.opts.verbose) {
      backpack.log(`generated ${chalk.yellow(doc.path)} --> ${chalk.green(outPath)}`)
    }
  })
}
