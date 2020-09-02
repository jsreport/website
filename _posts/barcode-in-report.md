{{{
    "title": "Barcode in report",
    "date": "09-02-2020 10:15"
}}}

Adding a barcode to a [pdf](/learn/chrome-pdf) or any kind of other reports is pretty easy since jsreport announced [asynchronous helpers](/learn/templating-engines#asynchronous-helpers).

At first, let's find a proper npm module that can do the work. This can be for example the [bwip-js](https://github.com/metafloor/bwip-js).  This module exports asynchronous function `bwipjs.toBuffer()` returning promise with the image buffer. This is what we want to call in a helper. The [Handlebars](/learn/handlebars) and also other templating engines don't support asynchronous helpers, but fortunately, jsreport engines sandbox has this covered out of the box and you can safely return a promise from helpers.

The helpers section can look like this:
```js
const bwipjs = require('bwip-js');

function barcode()  {
  return bwipjs.toBuffer({
    bcid:  'code128',
    text:  '0123456789',
    scale:  3,
    height:  10,
    includetext:  true,
    textxalign:  'center',
  }).then(p => p.toString('base64'))
}
```

Then lets call the helper in the template content:
```html
<img  src='data:image/png;base64,{{barcode}}' />
```

The result is the barcode image. This works with mostly every recipe. You can add the barcode this way to the [docx](/learn/docx), [pptx](/learn/pptx) or also [xlsx](/learn/xlsx) reports.

![barcode](/blog/barcode.png)

