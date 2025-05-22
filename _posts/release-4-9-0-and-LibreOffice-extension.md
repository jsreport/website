{{{
    "title": "Release 4.9.0 and LibreOffice extension",
    "date": "05-22-2025 09:18"
}}}


[jsreport 4.9.0](https://github.com/jsreport/jsreport/releases/tag/4.9.0) is here and brings a new LibreOffice extension and other improvements.

## LibreOffice extension
The [LibreOffice](https://www.libreoffice.org/) command line API provides great capabilities for converting or printing Office documents. This API is now wrapped in the custom extension [jsreport-libreOffice](https://jsreport.net/learn/libreoffice), which can be additionally installed from npm or used with the [jsreport full docker image](https://jsreport.net/learn/docker).

The extension provides studio UI as well as the [jsreport scripts](https://jsreport.net/learn/scripts) API that can be used to trigger converting or printing.

```js
const jsreport =  require('jsreport-proxy')  
async  function  afterRender(req, res)  {  
	const pdf =  await jsreport.libreOffice.convert(
		res.content,  
		'pdf',  
		{ pdfExportSelectPdfVersion:  15  }
	) 
	res.content = pdf.content }
```

Note this extension replaces the [jsreport-unoconv](https://jsreport.net/learn/unoconv) extension which si now deprecated and will be removed from the full docker image in v5.

## docx images loader function

The `docxImage` helper now supports passing a custom loader function that loads the image. This is useful when you need more control over how the image is loaded. You may want to use a custom timeout or pass authentication headers.

```
{{docxImage src=(myImageLoader imageInput)}}
```
```js
function myImageLoader (src)  {
  return  async  function loader ()  {   
    const { imageStream, imageType } = await myImageFetchingLogic(src)
    return {
	    type: imageType, 
	    stream: imageStream 
    }
  }
}
```

A similar approach can be used with the `docxHtml` helper as well.
```js
{{docxHtml content=html imageLoader=(myImageLoader)}}
```

See the documentation for details.
https://jsreport.net/learn/docx


## Chrome improvements

### Resources timeout
The chrome-pdf printing waits for all resources to finish loading. This can be a problem if the report uses external resources like images, where the remote server hangs and the whole report times out.  This can now be solved using the new helper `chromeResourceWithTimeout`.

```html
<img src="{{{chromeResourceWithTimeout 'http://myImageUrl.png}}}' 2000}}"/>
```

The helper makes sure the resource loading gets canceled after the timeout. The resource won't be loaded, but the whole report passes.

### Connect remote Chrome
The Chrome printing is typically the HW resources bottleneck. If this is the problem, there is an option to connect remote Chrome instances to jsreport. This can be done using the following config.

```js
{  
	"chrome":  {  
		"strategy":  "connect",  
		"connectOptions":  {  
			"browserWSEndpoint":  "<endpoint to the remote instance of Chrome>"  
		}  
	}  
}
```
