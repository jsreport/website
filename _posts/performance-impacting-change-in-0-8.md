{{{
    "title"    : "Performance impacting change in v0.8",
    "date"     : "07-21-2015 13:53"
}}}

Almost a year ago I blogged about [jsreport performance](http://jsreport.net/blog/pdf-reporting-performance) when it comes to high scale. I was explaining some of the strategies we used to reach the level of almost 700 pdf pages being rendered per second. These strategies were mainly based on reusing workers for script execution and phantomjs instances over multiple requests. This approach is the backbone bone since then keeping the performance on the very good level which is a must for [jsreportonline](https://jsreportonline.net). Unfortunately this approach is based on creating internal web servers which is having troubles in some cloud and corporate environments.

This problem can be illustrated for example on the [OpenShift](https://www.openshift.com/) cloud which gives you just dedicated IP and port range you can use for your web server. This means you need to configure jsreport to this values before you are able to start it. The similar problem occurs also in the corporate environments with proxies. You can see this is a quite common problem also in github issues [#75](https://github.com/jsreport/jsreport/issues/75), [#89](https://github.com/jsreport/jsreport/issues/89), [#79](https://github.com/jsreport/jsreport/issues/79).

Finally we decided to make the old school rendering approach the default one. The old school approach is just creating dedicated phantomjs instance for every request. This is a bit slower, but doesn't have any of the previously mentioned problems. The slowdown is around 300ms per report which is acceptable for the most of the users and if you wan't to get more, you just need to change the jsreprot configuration.

So how to boost jsreport to the maximum performance? Update the configuration with the following values. This forces jsreport to reuses phantomjs instances as well as node instances over multiple requests as it was until v0.8.

```js
"phantom": {     
    "strategy": "phantom-server"
},
"tasks": {       
    "strategy": "http-server"
}
```
