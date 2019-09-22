
{{{
    "title"    : "Release 2.6.0",
    "date": "09-22-2019 19:30"
}}}

**jsreport 2.6.0 is now live.**    
You can find the full details and release notes in the [github releases](https://github.com/jsreport/jsreport/releases/tag/2.6.0) as always.  

The 2.6.0 brings dark theme, white labeling, new recipes and optimized single executable. Let's take a look in detail.  

## Dark theme  
The default jsreport now includes the dark theme. Every user can switch it through the studio settings or you can also switch it globally using jsreport configuration. See [studio](/learn/studio) documentation for the details.  

![dark-theme](/img/dark-theme.jpg)  

## White labeling  
The dark theme is built on the top of a more general feature introduced in the 2.6.0. The white labeling lets you create new studio themes and customize the colors and styles. The companies can add custom logos and adapt colors to their brand through jsreport configuration or through a custom theme extension.  

![white-labeling](/img/white-labeling.jpg)  

This topic is also deeply covered in the [studio](/learn/studio) documentation.  

## New recipes  
The [static-pdf](/learn/static-pdf) is now included as default jsreport recipe. No need to install it as a custom extension as in the previous version. Just to remind, it can be used to upload an existing pdf and simply output it. This is very handy in combination with [pdf-utils](/learn/pdf-utils) extension.  

The 2.6.0 also includes two recipes which were recently released. The [docx](/learn/docx) and [pptx](/learn/pptx) recipes can be used to produce office reports. You can put templating engine like [handlebars](/learn/handlebars) right to the uploaded word or powerpoint file and the recipe will evaluate the engine syntax and produce the final report.  

![docx](/img/docx.png)  

These recipes are still in the beta and their API may change, however, both are already included in the default installation so you can easily play with them and give us feedback. It is the future for producing word and powerpoint from jsreport.  

## Single executable optimizations  
jsreport 2.6.0 executables are now built using different technology. The main technical change is that it now embeds to the exe already compiled javascript modules and uses the virtual filesystem to reach them. This method is significantly faster for boot. The best performing rendering with `keepAlive` attribute is now 2x faster for pdf.

<hr/>    
That's all from the 2.6.0 highlighs. There also many smaller improvements included in the 2.6.0 which you can find in the [github release notes](https://github.com/jsreport/jsreport/releases).
As always, please fill github ticket or forum topic if you have any issues or suggestions.


