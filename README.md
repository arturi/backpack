# Backpack 🎒

Modular static site / blog / document generator. Helps you organize and pack your things and go explore!

- Backpack itself only runs plugins, passing `backpack` global state object and `opts` to each plugin.
- Everything else is done by individual plugins. In the example below we are using: `getDocumentList` → `parseDocumentMeta` → `renderAllIndividualHTML` → `renderRecentPage` (a few times, because this plugin is used for “recent” page, archive and feed!)

## Usage example

Create an `index.js`:

```js
const fs = require('fs-extra')
const chalk = require('chalk')
const md = require('./src/markdown.js')

const Backpack = require('./src/Backpack.js')
const backpackGetDocumentList = require('./src/plugins/backpack-getDocumentList.js')
const backpackParseDocumentMeta = require('./src/plugins/backpack-parseDocumentMeta.js')
const backpackRenderAllIndividualHTML = require('./src/plugins/backpack-renderAllIndividualHTML.js')
const backpackRenderRecentPage = require('./src/plugins/backpack-renderRecentPage.js')
const backpackTimer = require('./src/plugins/backpack-timer.js')

const templates = {
  doc: require('./templates/doc.js'),
  archive: require('./templates/archive.js'),
  recent: require('./templates/recent.js'),
  atomFeed: require('./templates/atom-feed.js'),
  main: require('./templates/main.js')
}

function build (opts, templates) {
  const backpack = new Backpack(opts)
  backpack.use(backpackTimer)
  backpack.use(backpackGetDocumentList, {
    pattern: '**/*.{md,markdown,txt,html,htm}'
  })
  backpack.use(backpackParseDocumentMeta, {
    cutTag: '<!--more-->',
    orderBy: { fields: 'timestamp', order: 'desc' },
    contentParser: (content) => {
      return md.render(content)
    }
  })
  backpack.use(backpackRenderAllIndividualHTML, {
    templates: templates,
    template: 'doc'
  })

  // only generate archive, recent and feed for blog
  if (opts.isBlog) {
    backpack.use(backpackRenderRecentPage, {
      templates: templates,
      template: 'archive',
      slug: 'archive',
      filter: (item) => item.published && item.type !== 'page'
    })
    backpack.use(backpackRenderRecentPage, {
      templates: templates,
      template: 'recent',
      paginate: 10,
      filter: (item) => item.published && item.type !== 'page'
    })
    backpack.use(backpackRenderRecentPage, {
      templates: templates,
      template: 'atomFeed',
      limit: 10,
      prettyUrl: false,
      slug: 'blog-feed.xml',
      filter: (item) => item.published && item.type !== 'page' && !item.backdated
    })
  }

  // backpack.use(backpackSaveCollectionState)
  backpack.use(backpackTimer)
}

try {
  const environments = JSON.parse(fs.readFileSync('./environments.json', 'utf-8')).environments
  environments.forEach(env => build(env, templates))
} catch (err) {
  console.log(chalk.red('Failed to pack the backpack:'), err)
}
```

And supply `environments.json` with config options, paths to content and output dirs, and i18n strings:

```js
{ 
  "environments": [
    { 
      "envName": "En",
      "dir": "content/en",
      "out": "public",
      "outPrefix": "ru",
      "verbose": false,
      "lang": "en",
      "isBlog": true,
      "siteUrl": "http://example.com",
      "image": "http://example.com/assets/profile.jpg",
      "strings": {
        "author": {
          "name": "Ron Ellington",
          "email": "ron@example.com"
        },
        "siteTitle": "Ron Ellington",
        "blogTitle": "Ron Ellington’s Blog"
      }
    },
    { 
      "envName": "Ru",
      "dir": "content/ru",
      "out": "public",
      "outPrefix": "en",
      "verbose": false,
      "lang": "ru",
      "isBlog": true,
      "siteUrl": "http://example.com",
      "image": "http://example.com/assets/profile.jpg",
      "strings": {
        "author": {
          "name": "Рон Эллингтон",
          "email": "ron@example.com"
        },
        "siteTitle": "Рон Эллингтон",
        "blogTitle": "Блог Рона Эллингтона"
      }
    }
  ]
}
```
