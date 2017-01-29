{{{
    "title"    : "jsreport hosting options on windows",
    "slug"     : "jsreport-hosting-options-on-windows",  
    "date"     : "07-23-2014 09:47"    
}}}

You have two options when hosting jsreport on premise on windows. You can host jsreport in windows service or you can host it in iis using [iisnode](https://github.com/tjanczuk/iisnode). We cannot say one way is better than the other one. It's up to you what you prefere. For example it will be more convenient for you to use iisnode if you have already couple of applications running in iis.

To install jsreport in windows service you can use [jsreport automated installer](https://jsreport.net/downloads).

To install jsreport in iisnode please proceed with following steps:

1. install [nodejs](http://nodejs.org/)
2. `cmd:` mkdir jsreport
3. `cmd:` cd jsreport
4. `cmd:` npm install jsreport
5. `cmd:` node node_modules/jsreport --init
6. remove httpsPort specification from created prod.config.json
7. download and place sample [web.config](https://github.com/jsreport/docs/blob/master/installation/web.config) into jsreport folder
8. install iisnode https://github.com/tjanczuk/iisnode
Don't forget to have iis installed with all Application development sub features and also iis [url rewrite extension](http://www.iis.net/downloads/microsoft/url-rewrite).
9. create standard iis website for jsreport folder and choose port and bindings you want, also don't forget to add security permissions to jsreport folder for IIS App Pool user when appropriate.
IMPORTANT: Create a separate website. Don't just add application to the default website.
10. try access website url in browser, jsreport should pop up
