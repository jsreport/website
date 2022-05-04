

{{{
    "title": "Release 3.5.0",
    "date": "05-04-2022 22:43"
}}}

**The jsreport 3.5.0 is here.**

There are some exciting new features in this release! Let's check it out.

## xlsx recipe

The problem of the `xlsx` recipe is mostly the complexity. Sometimes you need to spend a lot of time studying xlsx format to do even an easy thing. 

We got very positive feedback on the approach we took in the [docx](/learn/docx) recipe and this convinced us we should do the same with the [xlsx](/learn/xlsx) recipe. 

Now the `xlsx` recipe supports the evaluation of the [handlebars](/learn/handlebars) tags written directly in the desktop Excel app. This makes it super simple to implement basic things.  And when you need something complex, you can still use the original xlsx helpers to update xml at the low level.

![xlsx](https://jsreport.net/learn/static-resources/xlsx.png)

## pdf utils attachments

Finally, you can add attachments to the pdf. This is supported through a [custom script](/learn/scripts) now.
```js
const jsreport = require('jsreport-proxy')

async function afterRender(req, res) {
   const anAsset = await jsreport.documentStore.collection('assets').findOne({ name: 'myattachment.txt'})
   
   res.content = await jsreport.pdfUtils.addAttachment(res.content, anAsset.content, { name: 'my attachment' })
}
```

## pdf utils checkbox

You can also add checkboxes to the pdf forms now.
```
{{{pdfFormField name='isOnSale' type='checkbox' visualType='square' width='150px' defaultValue=true height='20px'}}}
```

## conditional background color in docx
The [docx](/learn/docx) recipe helper `docxStyle` now supports also `backgroundColor`
```
{{#docxStyle backgroundColor='0000FF'}}Simple text{{/docxStyle}}
```

## profiler
Studio profiler can now filter using template and rendering state. This opens new possibilities! Get just failed pasts requests? Find out when a particular template did run?

## what's next?
We will continue to improve the new `xlsx`, because that was just the beginning. We will ship jsreport v3 to the jsreportonline. Work on performance and bugs. We have [long backlog](https://github.com/jsreport/jsreport/issues).

Give us a heads up on what you are the most interested in.