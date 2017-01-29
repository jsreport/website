{{{
    "title"    : "What's new - jade, static resources, pdf triggers and more",  
    "date"     : "10-22-2015 11:03"
}}}

I am pleased to announce jsreport 0.9 is officially published to npm and ready to be used. I will quickly cover what is new.

##jade
jsreport now supports [jade language](http://jade-lang.com/) as the new templating engine. To get started you just need to type `npm install jsreport-jade`, restart jsreport and you should see `jade` in the engines combo box. The extension not only gives you the jade transformations but also the syntax highlighting.

More details here: [jsreport-jade](https://github.com/bjrmatos/jsreport-jade)
 
##New template store
We have overhauled jsreport template persistence implementation and found out it doesn't play well with the source controls. As the result we released in preview the new template store implementation which should replace the current one in the one of the next releases. The new implementation better structures templates into folders allowing you to easily use your favorite editors  instead of jsreport studio.

```
data / Sample Template
-- content.html
-- helpers.js
-- header.html
-- config.json

data / another template
-- content.html
...
``` 

Also one of the main highlights of the new implementation is automatic report preview on external template file change. **This is really cool, try it yourself !** Open jsreport studio and navigate to the particular template. Edit the `content.html` file in your favorite editor and hit save. jsreport recognizes this change, notifies the studio and preview the report without any action required.

More details here: [jsreport-fs-store](https://github.com/jsreport/jsreport-fs-store)


##Static resources
There were many votes in the community for supporting an easy linking of static scripts or styles into the report templates. We have listened to these votes and provided this functionality through the new extension.

1. npm install jsreport-static-resources
2. copy your scripts and files into the `data/staticResources`
3. use `$staticResources` templating engine variable to reference the resource
```
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="{{$staticResources}}/style.css">
    </head>
    ...
```

More details here: [jsreport-static-resources](https://github.com/jsreport/jsreport-static-resources)


##Phantom printing trigger
Another great feature released with jsreport 0.9 is particularly useful when you are using [phantom-pdf recipe](https://jsreport.net/learn/phantom-pdf). This improvement lets you to decide through template's javascript when the page is fully loaded and ready to be printed. First you need to enable this using `Wait for printing trigger` phantom menu or through API with setting `phantom.waitForJS=true`. This instructs jsreport to wait with pdf printing until you set `window.PHANTOM_HTML_TO_PDF_READY=true` inside your template.

```html
...
<script>
    // do some calculations or something async
    setTimeout(function() {
        window.PHANTOM_HTML_TO_PDF_READY = true; //this will start the pdf printing
    }, 500);
    ...
</script>
```

##Report file name
The last improvement allows you to dynamically specify jsreport `Content-Disposition` response header directly through the API request call. This is handy when you are piping jsreport response to the user and you want to automatically open browser's download dialog with particular file name.

> `POST`: /api/report    
> 
> `BODY:`
>```js 
   { 
      "template": { ... },
      "options": {  "Content-Disposition": "attachment; filename=myreport.pdf" }
   } 
>```

<hr/>

And more on the way, stay connected. You can follow me on twitter [@jan_blaha](https://twitter.com/jan_blaha) where I regularly post plenty of news regarding to jsreport.

