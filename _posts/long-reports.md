
{{{
    "title"    : "Long reports",
    "date"     : "08-18-2015 14:05"
}}}

Majority of reports being rendered through jsreport are just several number pages long pdf files. However some users needs to render pdf reports with hundreds or even thousands of pages. I was giving these users support during the last weeks and decided to blog post about it and describe what are the configuration options you need to set when receiving errors from the long reports rendering.

## Timeouts for template rendering and scripts
Rendering templating engine is usually very quick and it rarely takes longer than 5 seconds.  But when you have complex computations in helpers you may need to increase the default timeout for it. Note that all timeouts are specified in ms.

```js
"templatingEngines": {
        "timeout": 600000
}
```

To increase [scripts](/learn/scripts) use this configuration.

```js
"extensions": {
  "scripts": {
    "timeout": 600000
  }   
}
```

## Timeouts for pdf rendering
Pdf rendering on the other hand is the most time consuming task. It can easily take couple of minutes to render for longer reports. The timeout for [chrome-pdf](/learn/chrome-pdf) recipe can be set like this.
```js
"chrome": {
	"timeout": 600000
}
```

This will make timeout general also for the [html-to-xlsx](/learn/html-to-xlsx). If you want to set specific timeout just for the chrome-pdf recipe, use this config.

```js
"extensions": {
  "chrome-pdf": {
    "timeout": 600000
  }
}
```

Slow performance of pdf rendering is usually caused by intensive styling. To optimize the performance you need to find the particular style causing problems. This is difficult and there is no rule of thumb which styles are the cause.  I usually remove all styles and try to add all of them step by step and check the performance during it.

## Limits for input data sizes
To block the requests with a bad intentions jsreport has limits for input sizes. If you have a huge report input data you may also need to increase `inputRequestLimit `.
```js
"express": {
  "inputRequestLimit": "200mb"
}
```

## Out of memory
Bigger reports can also reach the default node.js memory limit with error 'Allocation failed - JavaScript heap out of memory'.  This can be mostly fixed by [increasing the limit](http://prestonparry.com/articles/IncreaseNodeJSMemorySize/) .

Set the `NODE_OPTIONS` environment variable
```
NODE_OPTIONS=--max-old-space-size=6096
```

Run jsreport
```
jsreport start
```

## Child templates
[Child templates](/learn/child-templates) are great and sometimes a must. However there is performance trade off to consider, because child templates always run through the whole rendering pipeline. Don't use them if you can replace them with [assets](/learn/assets). If you can't and render many of them, try to change the templating engines evaluation strategy to `http-server` or `in-process` to avoid creating too many evaluation processes.

```js
"templatingEngines": {
  "strategy": "http-server"
}
```

## Pdf utils merge
[Pdf utils](/learn/pdf-utils) are typically used to merge custom headers. If you render many pages, you should always select "merge whole document" option. Otherwise there will be extra header rendering for every page.

## Socket connection timeouts for rendering
The next problem can be caused by the closed http connection during the api call on `/api/report`. This is because the connection also has some timeouts when nothing is being transferred for a long time. 
 
```js
"extensions": {
  "express": {
	 "renderTimeout": 600000
  }
}
```

## Client connection timeouts
All of the previous settings are the jsreport server options, but the last one you may need to set is on the client side. Client rest libraries usually has default timeouts and you may need to increase it. The following code shows how to do it in c# client.

```csharp
ReportingService.HttpClientTimeout = TimeSpan.FromMinutes(20);
```