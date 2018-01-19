const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')
const fastmatter = require('fastmatter')
const moment = require('moment')

function getDescriptionFromString (string, length) {
  length = length || 400
  let description = string.replace(/<(?:.|\n)*?>/gm, '')
  description = description.replace(/\n\n/, '')
  description = description.substring(0, length)
  return description
}

module.exports = function backpackParseDocumentMeta (backpack, opts) {
  backpack.log(`Parsing meta...`)

  moment.locale(backpack.opts.lang || 'en')

  backpack.documents = backpack.documentList.map((docPath) => {
    const rawDoc = fs.readFileSync(`${backpack.opts.dir}/${docPath}`, 'utf-8')
    const parsedDoc = fastmatter(rawDoc)
    const stat = fs.statSync(`${backpack.opts.dir}/${docPath}`)
    const docFileName = path.basename(docPath)

    const doc = parsedDoc.attributes
    doc.content = parsedDoc.body && parsedDoc.body.trim()

    if (opts.contentParser) {
      doc.content = opts.contentParser(doc.content)
    }

    doc.path = docPath
    doc.stat = stat
    doc.slug = docFileName.substr(0, docFileName.lastIndexOf('.'))
    doc.url = path.join('/', backpack.opts.outPrefix, doc.slug, '/')
    doc.absoluteUrl = backpack.opts.siteUrl + doc.url
    doc.datePublished = doc.datePublished || moment.utc(doc.stat.mtime).format('YYYY-MM-DD HH:mm')
    doc.timestamp = moment.utc(doc.datePublished).format('x')
    doc.stringDate = moment.utc(doc.datePublished).format('D MMMM YYYY')
    doc.isoDate = moment.utc(doc.datePublished).format('YYYY-MM-DDTHH:mm:ssZ')

    let excerpt
    let more
    if (opts.cutTag) {
      [excerpt, more] = doc.content.split(opts.cutTag)
    }

    doc.excerpt = excerpt && excerpt.trim()
    doc.description = doc.description || getDescriptionFromString(doc.excerpt)
    doc.more = more && more.trim()

    return doc
  })

  const used = process.memoryUsage().heapUsed / 1024 / 1024
  console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`)

  if (opts.orderBy) {
    backpack.documents = _.orderBy(backpack.documents, opts.orderBy.fields, opts.orderBy.order)
  }
}
