{{{
    "title"    : "jsreport 1.0 is here",	
    "date"     : "06-24-2016 17:30"
}}}

jsreport 1.0 is now available in [npm](https://npmjs.com/package/jsreport) and  you can start installing it in the common way:

**`npm install jsreport --production`**

You can also find upgrade instructions [here](https://jsreport.net/learn/upgrading-to-10).

See some of the many improvements jsreport 1.0 brings.

##New studio
You can be looking forward for completely reworked jsreport studio. The new studio feels more like an IDE and it should dramatically improve the productivity during reports development.

![studio](https://jsreport.net/img/jsreport-studio.gif)


##Excel with charts or images
Based on the user requests we also reworked [xlsx](https://jsreport.net/learn/xlsx) recipe and added support for images, charts or even pivot tables. See the [xlsx recipe docs](https://jsreport.net/learn/xlsx) for details.

![xlsx](https://jsreport.net/blog/excel-chart.png)

##Startup time
jsreport 1.0 server now starts usually in just 2 seconds. The slow startup of jsreport 0.x was mainly caused by searching for applicable extensions in the application directory. This is mitigated in 1.0 with caching extensions' locations. 


##Compiled template caching
jsreport 1.0 significantly improves the performance of templating engines evaluation using cache for the compiled templates. You can automatically benefit from it if you use `http-server` or `in-process` strategy for the server scripts evaluation:
```js
{
  "tasks": {
    "strategy": "http-server"        
  }
}
```

##jsrender custom tags
The fans of [jsrender engine](https://jsreport.net/learn/jsrender) can now enjoy using helpers as custom tags. 

```js
function boldp(val) {
   return "<p><b>" + this.tagCtx.render(val) + "</b></p>";
}
```
```html
{{boldp}}
    This is inside our block content:<br/>
    <em>{{:title}}</em>
{{/boldp}}
```

##Last failed logs
The new jsreport studio includes startup page with more relevant information now. You can easily check the logs for last requests or quickly open last edited templates.

![failed-requests](https://jsreport.net/img/blog/failed-requests.png)

##Child templates parameters
You can now pass additional parameters to child templates or override its properties through the child template tag.

```html
{#child myChildTemplate @template.recipe=html @data.paramA=foo @options.language=sp}
```

And more... upgrade and see it yourself.