const fs = require('fs-extra')
const randomString = require('randomstring')

const NUMBER_OF_FILES = 10000

const startTime = Date.now()
console.log(`🤖  Generating ${NUMBER_OF_FILES} files...`)

for (var i = 0; i < NUMBER_OF_FILES; i++) {
  var fileName = randomString.generate(15)
  var fileContent = `---\ntitle: ${randomString.generate(20)}\npublishedDate: ${Date.now()}\n---\nmy **post** is [here](http://google.com)!\n ${randomString.generate(20000)}`

  fs.outputFileSync(`./random/${fileName}.md`, fileContent)
}

const endTime = Date.now()
const timeSpent = (endTime-startTime) / 1000
console.log(`🤖  Wow! Backpack’s dummy generator has generated ${NUMBER_OF_FILES} files in ${timeSpent} seconds!`)
