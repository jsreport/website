{{{
    "title"    : "Pdf report paging and page breaks",  
    "date"     : "04-17-2014 08:16",
    "preview"  : "If you are using phantom-pdf recipe and struggling with paging in the pdf document, this article is just for you. "
}}}


>**The example report is [here in playground](https://playground.jsreport.net/w/anon/~U6DJbEz)**

If you are using phantom-pdf recipe and struggling with paging in the pdf document, this article is just for you. The key information you need to achieve paging is the fact that phantom-pdf has the full support for css styles. One of the styles that allows to break the page in css is called [page-break-before](http://www.w3schools.com/cssref/pr_print_pagebb.asp). You can add this css style to  any of the element and it will wrap the page. Look at the following example

```html
<h1>Hello from Page 1</h1>

<div style='page-break-before: always;'></div>

<h1>Hello from Page 2</h1>

<div style="page-break-before: always;"></div>

<h1>Hello from Page 3</h1>
```

This generates 3 pages. You can be even smarter and make your report code more readable by adding own css class for paging. 
So a little bit improved code sample can look like this.

```html
<style>
.page-break	{ display: block; page-break-before: always; }
</style>

<h1>Hello from Page 1</h1>

<div class='page-break'></div>

<h1>Hello from Page 2</h1>

<div class="page-break"></div>

<h1>Hello from Page 3</h1>
```
