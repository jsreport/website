{{{
    "title"    : "Debug extension",	
    "date"     : "02-18-2016 17:59"	
}}}

[jsreport-debug](https://github.com/jsreport/jsreport-debug) extension is now part of the official jsreport distribution. It doesn't allow the true debugging, but it can be very handy when troubleshooting problems with helpers, scripts or phantomjs.

To invoke the template rendering in the "debug" mode you need to click the `debug` icon in the studio toolbar. This instructs jsreport to collect all logs and `console.log` messages related to the particular request and provide them in the preview panel. This way you can easily read warnings and messages from the phantomjs. Also every message written to `console.log` in a helper or custom script will be visible in the preview.

You can find more information about this extension on github page [jsreport-debug](https://github.com/jsreport/jsreport-debug).

![debug](https://jsreport.net/blog/jsreport-debug.gif)