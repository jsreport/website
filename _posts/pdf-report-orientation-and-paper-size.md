{{{
    "title"    : "Pdf report orientation and paper size",	
    "date"     : "04-20-2014 16:58"	
}}}

Today we are announcing support for configuring pdf page orientation and paper size in phantom-pdf recipe. It's available in all versions of jsreport (playground, online and on prem) so you can check it out. 

The configuration is accessible in the `Phantom Pdf` menu.

![paper size](http://jsreport.net/img/blog/paper-size.png)

You can see you have several options for pdf paper format - `A3`, `A4`, `A5`, `Legal`, `Letter` and `Tabloid`. And that you can switch paper orientation between `portrait` and `landscape`. `Paper width` and `Paper height` takes precedence over `Paper Format` and can be filled with following units: `mm`, `cm`, `in` and `px`.

You can visit [original phantomjs documentation](https://github.com/ariya/phantomjs/wiki/API-Reference-WebPage#webpage-paperSize) and read more details about the options you have.