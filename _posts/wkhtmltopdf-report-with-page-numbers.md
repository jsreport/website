{{{
    "title"    : "wkhtmltopdf report with page numbers",	
    "date"     : "02-04-2016 11:09"	
}}}

> **The online example is accessible [here](https://playground.jsreport.net/#playground/bkBXJqNOae/14)**

I am sharing here a simple snipped showing how to add page numbers into a report based on [wkhtmltopdf](https://jsreport.net/learn/wkhtmltopdf) recipe. It is a bit more complicated than in [phantom-pdf](https://jsreport.net/learn/phantom-pdf) recipe, but the result is the same.

The page number and other information are passed into the header's `window.location.search` variable by wkhtmltopdf. You just need to pick it up with javascript and place it anywhere you want. 

Put the following into the `wkhtmltopdf.header` and see the output.

```html
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    Page <span id='page'></span> of 
    <span id='topage'></span>   
    <script> 
      var vars={};
      var x=window.location.search.substring(1).split('&');
      for (var i in x) {
        var z=x[i].split('=',2);
        vars[z[0]] = unescape(z[1]);
      }
      document.getElementById('page').innerHTML = vars.page; 
      document.getElementById('topage').innerHTML = vars.topage; 
    </script> 
  </body>
</html>
```
