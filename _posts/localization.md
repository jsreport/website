{{{
    "title"    : "Localization",
    "date"     : "04-10-2015 17:30"
}}}

Shortly after the [0.3 release](/blog/release-03) we are shipping jsreport 0.4 which includes new **[resources extension](/learn/resources)** with support for localization.

**Resources extension** lets you to move all the localizable strings outside the report template content and just reference them using javascript templating engines. jsreport resources extension then provides the right resource to the rendering process based on the requested language.

Let's say you want to print the pdf report with message "Dear user" in a language based on the request. First you need to create jsreport [data items](/learn/inline-data) for all languages you want to support and prefix data item with the language name. So for example you need to create:

```js
data item: en-test
{
	"message": "Dear user"	
}
```

```js
data item: de-test
{
	"message": "Lieber Nutzer"	
}
```

Then you attach both of these items to the template using new jsreport studio extension box. 

To reference the message in the template content you use newly provided `$localizedResource` property:
```html
{{:$localizedResource.message}}
```

Then you just specify the requested language in the jsreport studio or in the API call using `options.language` property and you get the localized report back.

Interesting? Check [documentation for details](/learn/resources).