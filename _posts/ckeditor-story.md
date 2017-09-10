{{{
    "title"    : "CKEDITOR story",
    "date"     : "05-22-2015 19:05"
}}}

> Checkout the example in **[playground](https://playground.jsreport.net/studio/workspace/-yOj_BkNlg/19)**

Popular WYSIWYG [CKEDITOR](http://ckeditor.com/) works well with jsreport and it can be very nicely used together with [html-with-browser-client](/learn/html-with-browser-client) recipe and self printing exporting reports.

##Story...
Imagine you often need to create a pdf document like an invoice. This document includes some of your inputs but also inputs from a customer. So you need to ask the customer for these information every time. Then you may need to send the filled document back to the customer but he requires changes so he sends it back to you to update the document and this goes on and on. 

**Lets AUTOMATE it!**

1. Create a document using javascript templating engines based on input data, this is a [get started](/learn/get-started) article
2. Make the document self exportable into pdf using [html-with-browser-client](/learn/html-with-browser-client) recipe
3. Use [scripts](/learn/scripts) extension to automatically send the mail with the report
4. **The final trick... Add CKEDITOR and let the end user to update the content before exporting to the pdf**

Integrating CKEDITOR is actually pretty easy:

1. just reference it from the CDN in your template. 
2. add `contenteditable="true"` attribute to the element you want to have editable
3. that is it, note that you can use javascript to validate user inserted correct values or other required stuff 

> Checkout the example in **[playground](https://playground.jsreport.net/studio/workspace/-yOj_BkNlg/19)**

![ckeditor](https://jsreport.net/img/blog/ckeditor.png?q)