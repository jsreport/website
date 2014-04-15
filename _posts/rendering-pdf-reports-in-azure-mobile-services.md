{{{
    "title"    : "Rendering pdf reports in Azure Mobile Services",  
    "date"     : "03-23-2014 15:56"
}}}

> Are you searching for an easy way how to render pdf report in your [Azure Mobile Services](http://www.windowsazure.com/en-us/develop/mobile) application? [jsreport](http://jsreport.net) is here with the help.

## Quick Hello World

First create an API in you Azure Mobile Services(AMS) application. Then insert following script into it.

```js
exports.get = function(request, response) {
  //AMS is trying to add it's own headers too late, we don't want it  
  response.setHeader = function(field, val){};
   
  require("request").post({
               uri: 'https://playground.jsreport.net/api/report',
               body: { template: { content: "<h1>Hello from jsreport</h1>", recipe:"phantom-pdf" } },
               json: true        
       }).pipe(response);
};
```
Now save the script and request the api from the browser. You should get back pdf directly to the current window. That is the jsreport magic. What is actually happening? The script is using `request` node module to access jsreport api. jsreport will receive report template with html content, print html into pdf using [phantomjs](http://phantomjs.org) and then is the response from jsreport piped to the browser. That is it. Very simple hello world using free [jsreport playground](https://playground.jsreport.net).

You can also attach images into pdf, render dynamic content using javascript templating engines or even render svg or fractals using jquery. To get more informations see [learn section](http://jsreport.net/learn) or quick start video on [youtube](https://www.youtube.com/watch?v=L7MZqwDCxP8). 

## Using jsreport online
jsreport playground is great for testing and fiddling with reports. But for the production use we recommend to create an account in [jsreport online](http://jsreport.net/online). With an account in jsreport online, you will get space where you can manage all your report templates, images, custom scripts and many other features. 

To create jsreport online account go [here](https://jsreportonline.net) and fill the registration form. When is the account ready, create your first report template using "New template" button.

![new-template](http://jsreport.net/screenshots/new-template.png)

Fill the name in the new template, content and switch jsreport recipe to phantom-pdf. This recipe will specify that report should be first rendered as html and afterwards printed into pdf using [phantomjs](http://phantomjs.org).

![hello-world-template](http://jsreport.net/screenshots/hello-world-template.png)

Now click the api button. This should open dialog with lot of useful informations about api options for this particular template.

![api-hello-world](http://jsreport.net/screenshots/api-hello-world.png)

The most important information is the `shortid`, so take it from there and go back to azure management portal. Take the following script and replace the one used previously.

```js
exports.get = function(request, response) { 
  var req = require("request")({
         method: 'POST',
         uri: 'https://[subdomain].jsreportonline.net/api/report',         
         body: { template: { shortid: "[shortid]" }, data: { name: "AMS and jsreport" } },
         json: true
  });
      
  //auth options for request does not work in AMS, let's add basic authorization 
  //header by hand                        
  req.setHeader('authorization', 'Basic ' + 
    new Buffer("[username]:[password]", "ascii").toString("base64"));
    
  response.setHeader = function(field, val){};  
  req.pipe(response);
};
```

Replace your jsreport account subdomain, shortid, username and password. Save the script and request it again from the browser. You should get back pdf rendered by your jsreport online account.

## Sending report as email attachment

Very common scenario is to attach pdf report to an email and send it. This can be achieved by using jsreport together with SendGrid, another great online service. If you don't have SendGrid in you AMS application yet, go [here](http://www.windowsazure.com/en-us/documentation/articles/sendgrid-dotnet-how-to-send-email/).

Rendering and sending pdf is pretty simple, when you have both accounts prepared. There are 3 steps required:

1. request jsreport api and get back pdf stream
2. convert stream into node.js buffer
3. attach buffer to sendgrid email and send it
 
```js
var req = require("request").post(       { 
        uri: 'https://[subdomain].jsreportonline.net/api/report',         
        body: { template: { shortid: '[template shortid]' }, data: [input data json] },
        json: true
});

req.setHeader('authorization', 'Basic ' + 
    new Buffer("[jsreport username]:[jsreport password]", "ascii").toString("base64"));
  
var bufs = [];
req.on('data', function(d){ bufs.push(d); });

req.on('end', function(){
  var SendGrid = require('sendgrid').SendGrid;
  var sendgrid = new SendGrid('[SendGrid username]', '[SendGrid password]');
     
  sendgrid.send({
          to: 'honza.pofider@seznam.cz',
          from: 'jan.blaha@hotmail.com',
          subject: 'pdf as attachment from jsreport',
          text: 'Hello from Azure Mobile Services',
          files     : [{filename: 'Report.pdf', content: Buffer.concat(bufs)}]
  }, function(success, message) {          
         console.log(success);     
  });
});  

```



