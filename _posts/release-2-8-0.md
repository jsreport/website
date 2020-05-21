
{{{
    "title"    : "Release 2.8.0",
    "date": "05-21-2020 13:30"
}}}


**jsreport 2.8.0 is here**  

You can find the full details and release notes in the [github releases](https://github.com/jsreport/jsreport/releases/tag/2.8.0) as always. Here I provide you the main highlights.

## Pdf utils
We've integrated `pdf-password`, `pdf-meta` and `pdf-sign` extensions into the [pdf utils](/learn/pdf-utils) so everything is now part of the default jsreport package and you don't need to install it as custom extensions. What is also great is that the pdf password protection was reimplemented into native javascript. This mean no headaches during installation. <br/><br/>
![280-utils](/blog/280-utils.png)

jsreport can now produce also fillable pdf forms. The fields can be simply added to the html using an extra helper call. See the details in the [pdf utils docs](/learn/pdf-utils#forms).

```html
<div>
    <span>Name:</span>
    <span>
    {{{pdfFormField name='firstName' type='text' width='200px' height='20px'}}}
    </span>
</div>
<div>
    {{{pdfFormField 
        name='btnSubmit' 
        type='button' 
        action='submit' 
        label='submit'
        exportFormat=true 
        url='http://mydomain.com'
        backgroundColor='#AAAA00' 
        width='245px' 
        height='20px' 
        }}}
</div>
```

## Docx
A lot of work was invested into further improvements and bug fixes of [docx](/learn/docx) recipe. The most visible improvement is probably the new `docxChart` helper. You can use it directly in the chart title to bind the data which makes it very elegant.

![docx](/blog/280-docx.png)

## Asynchronous helpers
The templating engine helpers can now return promises. This can be handy when a package you want to use doesn't provide sync API. You can for example use an async helper too resize images. This now works across all supported templating engines.

```html
<img src='{{{resize 'http://myimage.com'}}}' />
```

```js
const Jimp = require('jimp')

async function resize (url) {
    const newImage = await Jimp.read(url)
    newImage.resize(50, 50)
    const newImageDataUri = await newImage.getBase64Async(Jimp.AUTO)
    return newImageDataUri
}
```

## Studio improvements
We always want to include some improvements for developer productivity. This time we improved the studio entity tree with the ability to drop an exported zip or any other file that will be automatically uploaded as an asset.

![studio](/blog/280-studio.gif)

## Windows docker image
We now always include also windows based docker image with every release. See [dockerhub](https://hub.docker.com/r/jsreport/jsreport/) for the details.