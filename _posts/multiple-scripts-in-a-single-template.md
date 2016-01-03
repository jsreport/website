{{{
    "title"    : "Multiple scripts in a single template",
    "date"     : "12-15-2015 18:57"
}}}

One of the requested features finally arrived in fresh jsreport 0.11. Now you are able to **attach multiple [scripts](/learn/scripts) into a single template**. This  should open better structuring of the scripts. If you have for example multiple data sources, you can write one script for each and attach as many as you want to the report templates.

The scripts run in particular order as series. This means it is guaranteed for the second script that the first one has already finished. If you need to pass parameters between scripts you can set them into the `request.data` for example.

![scripts](http://jsreport.net/blog/scripts.gif)