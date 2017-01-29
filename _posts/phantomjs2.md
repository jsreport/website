{{{
    "title"    : "phantomjs2",	
    "date"     : "02-18-2016 16:36"	
}}}

[phantomjs](http://phantomjs.org/) team some time ago released the second major version with many improvements for pdf printing. Unlike the first version it for example supports web fonts or pdf clickable links. Unfortunately the release is still not stable enough to be used in jsreport [phantom-pdf](/learn/phantom-pdf) recipe as default, but we made it simple to additionally install it and use it.

1. Make sure you have latest jsreport 0.13

2. `npm install phantomjs-prebuilt`

3. Select `Use custom phantomjs` in the jsreport studio phantomjs menu


![phantomjs2](https://jsreport.net/blog/phantomjs2.gif)