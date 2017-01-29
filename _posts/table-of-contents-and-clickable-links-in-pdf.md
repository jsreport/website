{{{
    "title"    : "Table of contents and clickable links in pdf",
    "date"     : "05-22-2015 14:00"
}}}

Today I am releasing new jsreport recipe which is using [wkhtmltopdf](http://wkhtmltopdf.org/) utility to convert html into pdf. This recipe should add the most requested jsreport feature which is support for table of contents and clickable links in pdf generation.

![wkhtmltopdf](https://jsreport.net/img/blog/wkhtmltopdf.png)

This new recipe is not a core part of jsreport package right now and you need to additionally install it. You can find instructions as well as documentation under construction [here](/learn/wkhtmltopdf)

So right now jsreport has support for rendering pdf using 3 recipes:
- [phantom-pdf](/learn/phantom-pdf) - html to pdf conversion, the fastest pdf rendering, great for heavy scale, lack of support for TOC and links
- [fop-pdf](/learn/fop-pdf) - pdf rendering using Apache FOP, very advanced to use but gives the most precise results
- [wkhtmltopdf](/learn/wkhtmltopdf) - html to pdf conversion, not that fast as phantom but includes support for TOC and links