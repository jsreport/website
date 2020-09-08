{{{
    "title": "Pdf in typescript",
    "date": "09-08-2020 10:15"
}}}

**jsreport now includes a more complete typings for the [typescript](https://www.typescriptlang.org/).**    
This makes reports rendering from a nodejs/typescript app very comfortable including the type checks and IntelliSense.

![typescript](/blog/typescript.png)

The types are part of the [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) official typescript repository.    
We prepared for you also some examples to get started: [jsreport-typescript-example](https://github.com/jsreport/jsreport-typescript-example).

There are primary two main scenarios to cover.

## Remote jsreport server
In case you have your jsreport server already running and you just want to connect to it using [jsreport nodejs client](/learn/nodejs-client). You need to install the client and its types

```
npm i jsreport-client @types/jsreport-client
```

```js
import Client from 'jsreport-client'

const client = Client('http://localhost:5488')
let response = await client.render({
    template: {
        content: 'Hello {{message}}',
        engine: 'handlebars',
        recipe: 'chrome-pdf'
    },
    data: {
        message: 'from typescript client'
    }
})

```

## Inside nodejs app
In case you are integrating jsreport inside your nodejs app. You want to install jsreport and its types. 

```
npm i jsreport @types/jsreport
```

```js
  
import JsReport from 'jsreport'

const jsreport = JsReport()

jsreport.beforeRenderListeners.add('my listener', (req, res) => {
    console.log('my custom listener')
})

await jsreport.init()
...
await jsreport.close()

```

## Conclusion
We were not giving enough attention to the jsreport typings for quite some time, but now we commit ourselves to provide and maintain typescript typings.
Although the types aren't still fully covered, we will shortly cover most of them.
Please check our [typescript examples](https://github.com/jsreport/jsreport-typescript-example) and give it a try.
Of course, every contribution to the [DefinitelyTyped jsreport types](https://github.com/DefinitelyTyped/DefinitelyTyped) is welcome.