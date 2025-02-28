{{{
    "title": "Release 4.8.0 and improvements in office recipes",
    "date": "02-28-2022 18:04"
}}}

**Release 4.8.0 and improvements in office recipes**

It's been quite a while since the last 4.7.0 release and even more since the previous blog post. It's time to catch up and describe what we've accomplished.

## Office Office Office

The last few months have been mostly about improving office recipes. The goal was to provide the most competitive tool for office document generation integrated into all the goodness jsreport provides. This means you not only have the richest options to specify the office templates, but you can also benefit from the jsreport studio, assets, scripts, multiple storage drives, and so on. This makes this very unique solution out there.

Just look at the features we've added to the office recipes in the last months.

**docx**
- docxHtml support for `<colgroup>, <col>` tags in table (4.8.0)
- docxHtml: nested tables 
- docxHtml: row and cells support setting background color and color styles
- docxHtml: add border support for table, cell
- docxHtml: add padding, margin support for cells
- docxHtml: `ol` lists support the `start` param
- docxTable: support for vertical-align style
- docxTable: support `col` width customization
- docxTable support `col` width customization
- docxTable: support extra hash parameter `colsWidth` to allow setting custom `col` widths in the table
- docxStyle: add support for using  in loop
- docxObject: new helper for embedding `docx` file into another docx

**pptx**
- dynamic rows and columns generation support
- hyperlinks in loop
- pptxTable: support col width customization

**xlsx**
- xlsx add vertical loop support

**html-to-xlsx**
- support for vertical text (transform: rotate() to rotate text at certain angles, using together writing-mode and text-orientation)
- border styles normalization according to html table border collapsing rules

We will continue to improve office recipes and focus more on the `html-to-xlsx` which didn't get enough attention in the past, but now it's clear that a simple html to xlsx table conversion still makes sense in many cases.

## Big workspaces

We got a great chance from a customer to get a complete real workspace with 60 000 entities to analyze and optimize jsreport accordingly. This led to many smaller internal changes but some bigger you will notice.

If you use SQL or Mongo based template store drivers, you will notice that we now create indexes during schema creation.

If you use a file system template store, you will notice a dramatic improvement in transactional operations like import or folder hierarchy changes. This is because transactions in file system store were completely reimplemented.

## Canceling reports from studio

The studio "Profiler" page now has "Canceling" which you can use to cancel running requests. 

![canceling](/learn/static-resources/studio-cancel-profile.png)

## Conclusion 

Install the latest jsreport 4.8.0 and give it a try. If you have any things you would like to improve or support, don't hesitate to reach us at [forum](https://forum.jsreport.net/), [github repo](https://github.com/jsreport/jsreport) or [email](https://jsreport.net/about).