{{{
    "title"    : "WeasyPrint recipe",	   
    "date"     : "08-14-2017 09:35"	
}}}

We've just released yet another recipe doing pdf rendering based on html conversion. The new recipe package is called [jsreport-weasyprint-pdf](https://github.com/jsreport/jsreport-weasyprint-pdf) and uses [WeasyPrint](http://weasyprint.org/) library to process the conversion.

Why another recipe doing the same job as already existing [wkhtmltopdf](/learn/wkhtmltopdf), [phantom-pdf](/learn/phantom-pdf) or [electron-pdf](https://github.com/bjrmatos/jsreport-electron-pdf)? Because there is no clear winner which technology is the best and we want to give you the opportunity to choose the one which fits to you the most.

The [WeasyPrint](http://weasyprint.org/) excels in support for [css page rule](https://www.w3.org/TR/css3-page/). This allows you to use css standard to define page header or footer. The suport for this is very limited in other recipes and we believe that the new  [jsreport-weasyprint-pdf](https://github.com/jsreport/jsreport-weasyprint-pdf) can fill this hole.

The header and footer defined using [css page rule](https://www.w3.org/TR/css3-page/) can be as simple as this. This is were the WeasyPrint shines.
```css
@page {
    margin: 1cm 1cm;   
    @top-center {
        content: "My report header";
        vertical-align: bottom;
        border-bottom: 0.5pt solid 
    }
    @bottom-right {
        content: "Page " counter(page)
                 " of " counter(pages) 
    }  
}
```
<br/>
The biggest downside of the [WeasyPrint](http://weasyprint.org/) library is that it doesn't support javascript evaluation. This means no chart libraries and so on. **But wait!** The jsreport recipe is so smart that it the first evaluates javascript using phantomjs before it starts printing. This means that there should be no breaking barier for switching already existing templates into it. 
<br/><br/>

![weasyprint](https://jsreport.net/screenshots/weasyprint.png)
<br/><br/>

Please check the installation instructions in the [repository readme](https://github.com/jsreport/jsreport-weasyprint-pdf) and give us feedback how does it work for you.