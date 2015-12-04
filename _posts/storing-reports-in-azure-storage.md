{{{
    "title"    : "Storing reports in azure storage",  
    "date"     : "12-04-2015 22:53"
}}}

In some cases you want to render a report and store it for later reference, but you don't want to store it on your own and you rather want to let jsreport to do it for you. In this case you use  [reports extension](/learn/reports). This extension adds the url to the rendering response to let you know where is the report stored and it also adds some UI to jsreport studio where you can browse stored reports. 

[Reports extension](/learn/reports) is storing the reports inside blob storage where the default implementation is using file system to persist reports. This is quite simple, but it is not sufficient when it comes to the clustered environment or to high availability of reports. To solve this you need to use a different blob storage implementation.

Today we are shipping the first advanced blob storage implementation for jsreport. It is using [Azure Blob Storage](https://azure.microsoft.com/en-us/documentation/services/storage/) to persist reports in the cloud and it should fulfill the requirements for jsreport cluster or storage high availability.

To get started you need to install additional extension [jsreport-azure-storage](https://github.com/jsreport/jsreport-azure-storage)

> npm install jsreport-azure-storage

and configure it in the common configuration 

```js
{
    "blobStorage": {  
        "name": "azure-storage", 
        "accountName": "...", 
        "accountKey": "...", 
        "container": "..."
     }
}
```

Restart your jsreport server and now all the reports should be stored in azure. Enjoy!

You can find more information and configuration options in the github repository  [jsreport-azure-storage](https://github.com/jsreport/jsreport-azure-storage).




