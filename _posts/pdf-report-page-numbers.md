{{{
    "title"    : "Pdf report page numbers",  
    "date"     : "05-11-2014 14:03", 
	"preview"  : "Starting today jsreport also supports adding page numbers into report header and footer. This should be handy for big reports with many pages."
}}}

> The example accessible in [playground](https://playground.jsreport.net/#playground/gyHJRWnpn/5)

Recent [article](http://jsreport.net/blog/pdf-report-paging-and-page-breaks) shows how to add manual page wraps into html and let phantom-pdf recipe to split report into multiple pdf pages. Starting today jsreport also supports adding page numbers into report header and footer. This should be handy for big reports with many pages.

To add page number to header you can use special directives `{#pageNum}` and `{#numPages}`. Note that these two special directives can be used only in header/footer and will not have any affect if you place them inside the page content.

So to put to page numbers into every page header, just fill these special tags in the `Phantom PDF` menu into `Header` field.

![page-numbers-studio](http://jsreport.net/img/blog/page-numbers-header.png)

```html
<div style='text-align:center'>{#pageNum}/{#numPages}</div>
```

And the result will be:

![page-numbers](http://jsreport.net/img/blog/page-numbers.png)

