{{{
 "title" : "Release 2.4.0 higlights",	 
 "date" : "03-06-2019 15:26"	
}}}

This release brings 3 heavily requested features and additionally nice studio improvements.<br/>
Lets take look in the detail.

## html-to-xlsx
Many report developers were forced to abandon simple usage of [html-to-xlsx](/learn/html-to-xlsx) and had to switch to much more complicated [xlsx](/learn/xlsx) recipe because of the limitations of the first mentioned. I believe we solved the limitations in the 2.4.0 release and in most of the cases the `html-to-xlsx` will be enough. How?

**The recipe now supports setting data types of the cells using attributes.**

```html
<table>
    <tr>
        <td data-cell-type="number" data-cell-format-str="0.00">10</td>      
    </tr>
</table>
```

Additionally you can set cell format or even create a formula. All of this done in very simple way using attributes.

The improvements goes even further. You can use desktop excel and create xlsx template with charts and link it with the `html-to-xlsx` template. Your xlsx template then contains the definitions for charts and `html-to-xlsx` templates fills the dynamic data to another sheet. This way you can produce complex reports even with pivot tables, just  using `html-to-xlsx` recipe.

We have many [examples in the documentation](/learn/html-to-xlsx). Take a look.

## pdf table of contents
This is very problematic feature.  The headless chrome powering [chrome-pdf](/learn/chrome-pdf) doesn't have support for it and it is almost impossible to add TOC just with dynamic html and javascript because the page numbers aren't known in advance. Fortunatelly we found solution using jsreport [pdf utils](/learn/pdf-utils).

**The jsreport 2.4.0 now brings TOC support to pdf generated through chrome as probably the only tool out there.**

The trick is using [pdf utils](/learn/pdf-utils) merge operation to add TOC to the already produced pdf because at the time of the merge operation the page numbers are already known. This way the TOC can be fully customized using standard templating engines.

The updates in [pdf utils](/learn/pdf-utils) brings support also for adding bookmarks/outlines to the pdf. This means the TOC support is complete.

See the [playground example](https://playground.jsreport.net/w/admin/akYBA4rS).
And the [TOC section in the documentation](/learn/pdf-utils#toc-table-of-contents)


## chrome-image
The third havily requested feature was a new recipe. Recipe that can convert html into an  image. The 2.4.0 now brings new recipe [chrome-image](/learn/chrome-image) that does just that. It works the same way as [chrome-pdf](/learn/chrome-pdf) and it only produces the image output instead of the pdf.

## Studio improvements
We made several improvements to the UI to make the developers more productive. There is a specially new control for selecting entities in the tree. And the productivity feature that I personally like the most - quick jump to an entity using CTRL+p.

![navigate](/blog/navigate.gif)

## Release notes
We hope you enjoy this release. As always there are more detailed release notes availible at [github](https://github.com/jsreport/jsreport/releases/tag/2.4.0).



