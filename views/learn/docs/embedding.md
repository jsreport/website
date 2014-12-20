> `Embedding` extensions allows to open limited version of jsreport studio inside any web application and let end users to customize their reports. There are various scenarios where this can be used. Typical example can be when application is sending invoices to the customers and allows them to modify invoice template to the required design.

##Get started

Embedding jsreport is quite similar to inserting other frameworks to page like Facebook or twitter.  The most simple example of a web page with embedded jsreport editor looks following:

```html
<!DOCTYPE html>
<html>
<head lang="en">
	<!-- jquery is required for jsreport embedding -->
    <script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
</head>
<body>
	<script>
		//jsreport will call jsreportInit function from global scope when its initialized
	    jsreportInit = function () {
		    //lets open an editor with a report template
	        jsreport.openEditor({ content: "<h1>Hello World</h1>" });
	    };
	</script>

	<script>
		//add jsreport embedding script, just change url to jsreport server
	    (function (d, s, id) {
	        var js, fjs = d.getElementsByTagName(s)[0];
	        if (d.getElementById(id)) {
	            return;
	        }
	        js = d.createElement(s);
	        js.id = id;
	        js.src = "http://local.net:2000/extension/embedding/public/js/embed.js";
	        fjs.parentNode.insertBefore(js, fjs);
	    }(document, 'script', 'jsreport-embedding'));
	</script>
</body>
</html>
```
As you can see you need to fulfill four steps:
1. Include jquery into page
2. Add jsreport embedding script with target to running jsreport server
3. Create `jsreportInit` function in the global scope with similar meaning as `$.ready`
4. Use global object `jsreport` and its function `openEditor` to pop up jsreport

##Opening editor

`jsreport.openEditor` returns an even emitter to which you can bind and listen to the various events.

```js
jsreport.openEditor(template
	.on("template-change", function (tmpl) {
		//store changes
	    template= tmpl;
    }).on("close", function() {
	    //save template to your storage
    });
```

You can also submit additional options for jsreport extensions like sample data or custom script in the `openEditor` parameters.

```js
jsreport.openEditor({
    content: "<h1>Hello World</h1>",
    data: {
	    dataJson: {
	        price: "1234"
	    }
    }
});
```
Where `dataJson` can be any json object or parse-able json string.

You can also set up a [custom script](/learn/scripts) to the report template loading input data for the report preview. Using custom scripts user can even specify desired input data source on its own.

##Render report to the placeholder

jsreport does not only handle end user report customization but also dynamic report rendering. Use `jsreport.render` function for this:

```js
//render a template into the new tab
jsreport.render({ conent: "foo", recipe: "phantom-pdf", engine: "jsrender" });

//render a template into the placeholder
jsreport.render($("#placeholder"), { conent: "foo", recipe: "phantom-pdf", engine: "jsrender" });
```

##Html widgets

jsreport embedding together with [client-html recipe](/learn/client-html) makes powerful combination allowing to add end user customizable html widgets into every web application. If you want to provide to the end users such feature like customizable dashboard check [client-html recipe documentation](/learn/client-html) for more.

## Security

If you're running internet application and does not want to exposed your jsreport server into public you can create a tunnel forwarding request to jsreport through your application. This hides jsreport behind your security layers and also eliminates cross domain calls. You basically just need to catch and resend requests to jsreport and add `serverUrl` query parameter to specify where the jsreport web client should route requests back. In other words you create a route in your web server which will proxy jsreport server. Example of such a proxy in asp.net can be found [here](https://github.com/jsreport/net/blob/master/jsreport/jsreport.Client/JsReportWebHandler.cs). Implementing such a tunnel in any other language should not be difficult.

##Using jsreport storage

Previous chapters expected using an external storage for report templates. This is not a restriction. You can also configure embedded editor to use standard jsreport storage in [neDB](https://github.com/louischatriot/nedb) or [mongo](http://www.mongodb.org/).

Just use `useStandardStorage` option when opening editor:
```js
//open template from jsreport storage
jsreport.openEditor("Z1vT7FHyU", { useStandardStorage: true });
```

```js
//render template with particular shortid into the new tab
jsreport.render("byvZXxtkB");
```

When using jsreport template storage you can also benefit from method `jsreport.renderAll` which will render report into every html element with attribute `data-jsreport-widget`. This is mostly helpful when using `client-html` recipe.

```html
<div data-jsreport-widget="b1I_ThWlS" style="height: 500px"></div>
```
```js
jsreport.renderAll()
```

Authorizing users for access to particular templates stored in jsreport storage can be done using [authorization extension](/learn/authorization). This extension is designed not to maintain authorization rules but rather ask external service if the particular user should be authorized for particular operation.  This means it will ask your service every time user wants to access any jsreport data and you can evaluate authorization rules inside your system.
