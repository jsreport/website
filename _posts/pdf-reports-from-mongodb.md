{{{
    "title"    : "Pdf reports from mongodb",    
    "date"     : "09-27-2014 09:18"    
}}}

Rendering pdf reports from [mongodb](http://www.mongodb.org/) is a piece of cake with the new  [jsreport mongodb extension](https://github.com/jsreport/jsreport-contrib-mongodb). You don't need any application with API above mongo. Only thing you need is jsreport and valid accessible mongodb endpoint.

How does it work...

First [download](https://jsreport.net/downloads) and install jsreport to your machine or log into [reports as a service](https://jsreport.net/online) solution.  When downloading jsreport to your machine you need to also install [mongodb extension](https://github.com/jsreport/jsreport-contrib-mongodb) which is pre installed in the online service solution.

Next you need to create a custom node.js script accessing your mongodb and loading data you need. The script creation and evaluation is handled by jsreport standard [scripts extension](https://jsreport.net/learn/scripts) and it can look like this:

```javascript
//we can use mongodb node.js npm module
var MongoClient = require('mongodb').MongoClient; 
MongoClient.connect('mongodb://127.0.0.1:27017/maindb', function(err, db) {
    var collection = db.collection('people').find().toArray(function(err, results) {
	    //override report incoming data with results from mongo
        request.data = results;
        //notify jsreport we are done
        done();
    });
});
```

Custom script will prepare data for the report and now we can iterate over them and generate html from it using [javascript templating engines](https://jsreport.net/learn/templating-engines) jsreport supports. 

```html
<table> 
{{for people}}
    <tr>
        <td>{{:name}}</td>
        <td>{{:age}}</td>
    </tr>
{{/for}}
</table>
```

The output html will be then converted into pdf using jsreport default [recipe](https://jsreport.net/learn/recipes) using [phantomjs](http://phantomjs.org/).





