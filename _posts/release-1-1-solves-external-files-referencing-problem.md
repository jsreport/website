{{{
    "title"    : "Release 1.1 solves external files referencing problem",	   
    "date"     : "11-3-2016 14:00"	
}}}

**jsreport@1.1 is here!!!**

This release should fix the major pain jsreport was causing when referencing external files like styles or scripts and also brings some ui or performance improvements and bug fixes.

##New assets extension

Referencing external files with [jsreport-assets](http://jsreport.net/learn/assets) is now piece of cake. This extension which is now part of the default package lets you to simply upload or link external file and embed it into any place of the template, helpers or script using the similar notation as [child-templates](http://jsreport.net/learn/child-templates). See the [assets documentation](http://jsreport.net/learn/assets) for details.

![assets](http://jsreport.net/blog/assets.gif)

##Global scripts

Another great new feature lets you to turn a [custom script](http://jsreport.net/learn/scripts) into the global script. Such a script doesn't need to be linked to templates and runs automatically for every single one. This opens opportunities like adding common helpers into all templates. 

![global-script](http://jsreport.net/blog/global-script.gif)

##Studio improvements

Additionally to the mentioned new features jsreport@1.1 brings also some smaller UI improvements.

Like closing studio tabs using the mouse middle button

![closing](http://jsreport.net/blog/closing.gif)

Or new context menu for renaming entities

![rename](http://jsreport.net/blog/rename.png)

##xlsx performance

Performance is always the big deal for jsreport. This release brings really massive performance improvements into the [xlsx](http://jsreport.net/learn/xlsx) recipe. You can see it can handle almost 100 000 cells in 1 second and all of this with limited memory footprint.

![xlsx-perf](http://jsreport.net/blog/xlsx-perf.gif)

Let us know what you think about all of it!