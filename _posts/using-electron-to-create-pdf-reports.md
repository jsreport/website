{{{
    "title"    : "Using Electron to create pdf reports",	
    "date"     : "01-09-2016 14:09"	
}}}

I am happy to announce the new kid in the jsreport recipes family. Thanks to Boris Matos Morillo you can now use [Electron](http://electron.atom.io/) to print pdf reports from html. 

You can find this recipe in the repository [jsreport-electron-pdf](https://github.com/bjrmatos/jsreport-electron-pdf) where you also get installation instructions:
> npm install jsreport-electron-pdf
npm install electron-prebuilt

`jsreport-electron-pdf` has pretty much the same concept as the standard `phantom-pdf` recipe - let's dynamically create html report and then print it into html. The difference is in the technology used for converting html into pdf. The new recipe uses [Electron](http://electron.atom.io/) compared to the [Phantomjs](http://phantomjs.org/) used in the standard one. I won't compare these two now and I rather encourage you to check what you can get using `jsreport-electron-pdf` in the playground. 

>**Playground example can be found [here](https://playground.jsreport.net/#playground/ZJZMyHgm2e/2)**

![electron](https://jsreport.net/blog/electron.gif)

