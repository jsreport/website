{{{
    "title"    : "National characters in phantom pdf recipe",  
    "date"     : "03-15-2014 11:22"
}}}

I often get following image throught email from people starting with jsreport

![national characters](https://jsreport.net/blog/wtf.png)

This is what [phantom-pdf](https://jsreport.net/learn/phantom-pdf) recipe will render by default when you try to render some national characters (china, czech..)

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

![cesko](https://jsreport.net/blog/cesko.png)