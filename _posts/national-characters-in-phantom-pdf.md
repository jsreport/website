{{{
    "title"    : "National characters in phantom pdf recipe",  
    "date"     : "03-15-2014 11:22"
}}}

I often get following image throught email from people starting with jsreport

![national characters](http://jsreport.net/blog/wtf.png)

This is what [phantom-pdf](http://jsreport.net/learn/phantom-recipe) recipe will render by default when you try to render some national characters (china, czech..)

There is a easy fix for this. Add coding to the html header.
ščěščě
```html
<html>
  <head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
  </head>
  <body>
     Česko není Čečensko
  </body>
</html>
```

Then yoou will get proper result

![cesko](http://jsreport.net/blog/cesko.png)