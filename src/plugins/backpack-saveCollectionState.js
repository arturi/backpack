const fs = require('fs-extra')
const path = require('path')

module.exports = function backpackSaveCollectionState (backpack, opts) {
  const collectionWithoutContent = backpack.documents.map((doc) => {
    delete doc.body
    delete doc.content
    delete doc.more
    return doc
  })
  const collectionString = JSON.stringify({
    documents: collectionWithoutContent
  })
  const outPath = path.join(backpack.opts.out, backpack.opts.outPrefix, 'collection.json')
  fs.outputFileSync(outPath, collectionString)
}
