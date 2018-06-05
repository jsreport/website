{{{
    "title"    : "Pdf reports from mongodb",    
    "date"     : "09-27-2014 09:18"    
}}}

Rendering pdf reports from [mongodb](http://www.mongodb.org/) is a piece of cake. You don't need any application with API above mongo. Only thing you need is jsreport and valid accessible mongodb endpoint.

How does it work...

First [download](https://jsreport.net/on-prem) and install jsreport to your machine. 
Then install mongodb driver.

```sh
npm install mongodb --save
```

Make sure you opt in for using local modules in `jsreport.config.json`.

```js
{
  "httpPort": 5488,
  ...
  "allowLocalFileAcess": true
  ...
}
```

Next you need to create a custom node.js script accessing your mongodb and loading data you need. The script creation and evaluation is handled by jsreport standard [scripts extension](https://jsreport.net/learn/scripts) and it can look like this:

```js
const MongoClient = require('mongodb').MongoClient;

async function beforeRender(req, res) {
	const conn = await MongoClient.connect('mongodb://127.0.0.1:27017');
	Object.assign(req.data, { 
	  items: await conn.db('maindb').collection('people').find().toArray()
	});
}
```

Custom script will prepare data for the report and now we can dynamically build html using  [javascript templating engines](https://jsreport.net/learn/templating-engines).  It can look like this using [handlebars](https://jsreport.net/learn/handlebars).

```html
<table> 
{{#each items}}
    <tr>
        <td>{{name}}</td>
        <td>{{age}}</td>
    </tr>
{{/each}}
</table>
```

The output html will be in the end converted into pdf using jsreport default [chrome pdf recipe](https://jsreport.net/learn/chrome-pdf). This way you can query the report data source without any restrictions. The templating engines together with modern html to pdf converter provides full support for displaying fancy tables and charts. It is just up to you how the report will look like.




