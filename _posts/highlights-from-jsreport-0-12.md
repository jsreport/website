{{{
    "title"    : "Highlights from jsreport 0.12",	
    "date"     : "01-28-2016 13:54"	
}}}


[jsreport@0.12](https://www.npmjs.com/package/jsreport) has just shipped to the npm repository. I will shortly highlight the latest improvements, changes, features and later write more details about some of them.

##Development mode by default
Following node.js standards we have changed the default node environment for jsreport package to the development where it was previously production. What does it mean?

If you start jsreport with one of the following command:
```js
node server.js
or
npm start
```

Then jsreport initializes into the development settings. This means it applies `dev.config.json` instead of `prod.config.json`, it will start to do more intense logging and also use un-optimized original client js and css files.

To start in production you need to call
```js
set NODE_ENV=production&&node server.js
or
npm start --production
```

We recommend you to always explicitly set environment variable to be sure in which configuration you are starting. You will see also warning in the console output if don't set it up.

##Asynchronous report rendering
Rendering a report can take sometimes very long time and it can be technically difficult to handle these long connections. For these big reports it is also not intended to provide it synchronously to the user. It is usually rather a background job and the caller is interested just in the status of the processing and link to the final output intermediately after the request is submitted. And this is exactly what we provided in the [reports extension](http://jsreport.net/learn/reports) through the new `async` option. The asynchronous request looks the following:

> `POST:` https://jsreport-host/api/report
> `BODY:`
>```js 
   { 
      "template": { "shortid" : "g1PyBkARK" },
      "data" : { ... },
      "options": { 
	      "reports": { "async": true }
      }
   } 
>```

You still call the same API method with the same parameters. You only need to set `options.reports.async = true` and you get the response immediately back.

##SQL based template store
jsreport drivers for storing templates now supports also SQL based databases. In addition to [mongodb](https://github.com/jsreport/jsreport-mongodb-store) and [file system](https://github.com/jsreport/jsreport-fs-store) you can use new [Microsoft SQL Server](https://github.com/jsreport/jsreport-mssql-store) and [PostgreSQL](https://github.com/jsreport/jsreport-postgres-store) stores. This should simplify many integration scenarios and we are looking forward for your feedback. If you need a driver for another SQL database let us know and we provide it with priority. I will write more on this topic in a next post.




