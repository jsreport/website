{{{
    "title"    : "Long reports",
    "date"     : "08-18-2015 14:05"
}}}

Majority of reports being rendered through jsreport are just several number pages long pdf files. However some users needs to render pdf reports with hundreds or even thousands of pages. I was giving these users support during the last weeks and decided to blog post about it and describe what are the configuration options you need to set when receiving errors from the long reports rendering.

##Timeouts for template rendering and scripts
Rendering templating engine is usually very quick and it rarely takes longer than 5 seconds.  But when you have complex computations in helpers you may need to increase the default timeout for it. Note that all timeouts are specified in ms.

```js
"tasks": {
        "timeout": 600000
}
```

##Timeouts for pdf rendering
Pdf rendering on the other hand is the most time consuming task. It can easily take couple of minutes to render for longer reports. The timeout for phantom-pdf recipe can be set in the `phantom` node:
```js
"phantom": {
        "timeout": 600000
}
```

Slow performance of pdf rendering is usually caused by intensive styling. To optimize the performance you need to find the particular style causing problems. This is difficult and there is no rule of thumb which styles are the cause.  I usually remove all styles and try to add all of them step by step and check the performance during it.

##Socket connection timeouts for rendering
The next problem can be caused by the closed http connection during the api call on `/api/report`. This is because the connection also has some timeouts when nothing is being transferred for a long time. 
 
```js
"express": {
        "renderTimeout": 600000
}
```

##Limits for input data sizes
To block the requests with a bad intentions jsreport has limits for input sizes. If you have a huge report input data you may also need to increase `inputRequestLimit `.
```js
"express": {
        "inputRequestLimit": "20mb"
}
```

##Out of memory
Bigger reports can also reach the default node.js memory limit with error 'Allocation failed - JavaScript heap out of memory'.  This can be mostly fixed by [increasing the limit](http://prestonparry.com/articles/IncreaseNodeJSMemorySize/) using `max_old_space_size` nodejs argument.

```
node --max_old_space_size=4096 server.js
```

Note this will work only if you use `in-process` rendering strategy (`tasks.strategy='in-process'`). The `dedicated-process` as well as `http-server` based rendering strategy uses extra process to which you need to propagate the `max_old_space_size` argument using the following config.

```js
{
  "tasks": {
	  "strategy": "dedicated-process",
	  "forkOptions": {
	    "execArgv": ["--max-old-space-size=4096"]
	  }
  }
```


##Client connection timeouts
All of the previous settings are the jsreport server options, but the last one you may need to set is on the client side. Client rest libraries usually has default timeouts and you may need to increase it. The following code shows how to do it in c# client.

```csharp
ReportingService.HttpClientTimeout = TimeSpan.FromMinutes(20);
```