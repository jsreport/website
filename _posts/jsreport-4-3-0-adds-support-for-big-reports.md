
{{{
    "title": "jsreport 4.3.0 adds support for big reports",
    "date": "03-22-2024 11:01"
}}}


We've released jsreport 4.3.0 which among other fixes and features adds support for bigger reports. This is primarily visible on big text outputs like CSV or XML with millions of records which where until now hitting memory limits. 

The 4.3.0 implements response streaming technique to decrees memory consumption when possible. It adds `jsreport.templatingEngines.createStream` function which you can use to start streaming from handlebars to chunked files and limit the memory consumption to a minimum.

To demonstrate this, lets assume we want to render 1GB big CSV.  Such output would crash on max string size nodejs limit if we used common looping in handlebars. Instead, we implement our own each loop with the use of `jsreport.templatingEngines.createStream`.
```js
const jsreport = require('jsreport-proxy')
async function myEach(items, options) {
    const stream = await jsreport.templatingEngines.createStream()
    for (let item of items) {        
        await stream.write(options.fn(item))
    }
    return await stream.toResult()
}
```

And simly use the `myEach` helper as normal `each` and generate CSV from input.
```html
{{#myEach myData}}
  {{colA}};{{colB}};{{colC}}
{{/myEach}}
```

The `stream` object will make sure data are streamed through files instead of big memory string. This allows the creation of infinite-sized reports.  **See the [full playground demo](https://playground.jsreport.net/w/admin/Iu6v6TJJ)**.

Not only the text reports benefit from the new response streaming implementation. The plain chrome generation now also lowers the memory footprint as well as the docx generation with multiple remote images. This doesn't need your attention because it just runs in the stream way on the background by default. In the next steps, we will adapt extensions like pdf-utils to work fully with streams providing reports with a low memory footprint as well.

While the streaming implementation was the main asset, there are also other fixes and improvements, please see the 4.3.0 [release notes](https://github.com/jsreport/jsreport/releases/tag/4.3.0) for details.