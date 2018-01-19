const fs = require('fs-extra')
const chalk = require('chalk')
const _ = require('lodash')
const path = require('path')

function getPageNumberUrl (prefix, pageNumber) {
  let url
  if (pageNumber === 1) {
    url = prefix + '/'
  } else {
    url = `${prefix}/page/${pageNumber}/`
  }

  return url.replace(/\/\//, '/')
}

module.exports = function backpackRenderRecentPage (backpack, opts) {
  opts = Object.assign({}, { slug: '/', prettyUrl: true }, opts)

  backpack.log(`Generating recents page ${opts.slug ? chalk.yellow(chalk.underline(opts.slug)) : ''} ${opts.paginate ? `with pagination` : ''}...`)

  let collection = backpack[opts.collection] ? backpack[opts.collection].slice() : backpack.documents.slice()

  if (opts.filter) {
    collection = collection.filter(opts.filter)
  }

  if (!collection.length) {
    backpack.log('Empty collection: check your filters or add documents')
    return
  }

  if (opts.paginate) {
    let documentsPerPage = opts.paginate
    const totalPages = Math.ceil(collection.length / documentsPerPage)
    _.range(totalPages).forEach((pageNumber) => {
      pageNumber++
      const startPos = (pageNumber - 1) * documentsPerPage
      const prefix = path.join('/', backpack.opts.outPrefix, opts.slug)
      const page = opts.templates[opts.template]({
        collection: collection.slice(startPos, startPos + documentsPerPage),
        url: path.join('/', backpack.opts.outPrefix, opts.slug, getPageNumberUrl(opts.slug, pageNumber), '/'),
        backpack: backpack,
        previousUrl: pageNumber > 1 ? getPageNumberUrl(prefix, pageNumber - 1) : null,
        nextUrl: pageNumber < totalPages ? getPageNumberUrl(prefix, pageNumber + 1) : null,
        currentNumber: pageNumber
      }).trim()
      const outPath = path.join(
        backpack.opts.out,
        backpack.opts.outPrefix,
        getPageNumberUrl(opts.slug, pageNumber),
        'index.html'
      )
      fs.outputFileSync(outPath, page)
      if (backpack.opts.verbose) {
        backpack.log(`rendered ${chalk.yellow(opts.pageType)} → ${chalk.green(outPath)}`)
      }
    })
    return
  }

  if (opts.limit) {
    collection = collection.slice(0, opts.limit)
  }

  const outPath = path.join(
    backpack.opts.out,
    backpack.opts.outPrefix,
    opts.slug,
    opts.prettyUrl ? 'index.html' : ''
  )
  const page = opts.templates[opts.template]({
    collection: collection,
    backpack: backpack,
    url: path.join('/', backpack.opts.outPrefix, opts.slug, '/'),
    slug: opts.slug
  })
  fs.outputFileSync(outPath, page)

  if (backpack.opts.verbose) {
    backpack.log(`rendered ${chalk.yellow(opts.pageType)} → ${chalk.green(outPath)}`)
  }
}
