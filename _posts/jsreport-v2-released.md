
{{{
    "title"    : "jsreport v2 released",	   
    "date"     : "05-10-2018 14:32"	
}}}



jsreport second major release is now live. This release includes new features as well as breaking changes that accumulated over the last two years. 

You can install jsreport v2 by following the common steps on [download page](https://jsreport.net/on-prem).<br/>
To migrate existing v1 instance to v2 please follow the [migration guide](https://jsreport.net/learn/v2-breaking-changes).

See now the v2 highlights.

## Chrome by default

The biggest change is replacement of [phantomjs recipes](https://jsreport.net/learn/phantom-pdf) with [chrome based recipes](https://jsreport.net/learn/chrome-pdf) in default jsreport installation.  The [phantomjs project is currently suspended](https://github.com/ariya/phantomjs/issues/15344) and [chrome-pdf](https://jsreport.net/learn/chrome-pdf) recipe has better support for modern technologies so it is clear winner at this moment.

## New extensions

The v2 default installation includes several new extensions improving productivity.

**[version-control](https://jsreport.net/learn/version-control)** - version changes in templates and use commands like "commit" or "checkout" right from the studio<br/>
**[pdf-utils](https://jsreport.net/learn/pdf-utils)** - join multiple pdfs, merge dynamic headers or watermark<br/>
**[freeze](https://github.com/jsreport/jsreport-freeze)** - avoid accidental changes in production templates

## File system store

The [fs-store](https://jsreport.net/learn/fs-store) was re-implemented from the ground up to support running in cluster. Multiple instances can now share the same file system. Another improvement is also support for Azure Blob Storage and AWS S3 drivers. 

## Improved scripts

The [custom scripts](https://jsreport.net/learn/scripts) can now return promise and query jsreport document store. This makes it easy to load a custom configuration for example.
```js
const jsreport = require('jsreport-proxy')
async function beforeRender(req, res) {
  const assets = await jsreport.documentStore.collection('assets').find({name: 'myConfig'})
  const config = JSON.parse(assets[0].content.toString())
  req.data.config = config
}
```

## Query string parameters

The reports rendered through link propagates the query string parameters to the rendering pipeline
[https://jsreport.org/templates/Byz1CG_Kl?paramA=foo]()

```js
function beforeRender(req, res) {
  const paramA= req.context.http.query.paramA
  req.data.paramA = paramA
}
```

## Configuration changes

We have renamed or changed several properties in the jsreport configuration to make it more readable. The `connectionString` was for example renamed to `store` or `tasks` to `templatingEngines`. The extensions configuration is now also nested into `extensions` node. See the [migration guide](https://jsreport.net/learn/v2-breaking-changes) for the full list of changes and utility to automate existing config update.

The configuration additionally supports global property `allowLocalFilesAccess` which is handy shortcut that lets scripts or helpers require custom node modules and assets to read local files. 

```js
{
	"httpPort": 5488,
	"allowLocalFilesAccess": true,
	"store": {
		"provider": "fs"
	},
	"templatingEngines": {
		"timeout": 10000
	}	
	"extensions": {	
		"scripts": {
			"timeout": 30000
		}
	}
}
```

The configuration is in v2 also validated against schema which can be printed using
```
jsreport help config
```

## Conclusion

We hope you like this release. As always, please use our [forum](https://forum.jsreport.net) in case of questions or problems.