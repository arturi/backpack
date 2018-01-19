const MarkdownIt = require('markdown-it')
const MarkdownItTaskLists = require('markdown-it-task-lists')
const md = MarkdownIt({html: true, breaks: true}).use(MarkdownItTaskLists)

module.exports = md
