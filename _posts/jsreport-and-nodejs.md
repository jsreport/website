{{{
    "title"    : "jsreport and node.js",
    "slug"     : "jsreport-and-node.js",
    "date"     : "09-02-2014 21:20"
}}}

It's well now jsreport is being developed in [node.js](http://nodejs.org/). It was a shame there was no resources about jsreport for those developers using this great language. But this is now changed. Today I am announcing improvements in three major areas related to node.js:

1. new node.js remote client for jsreport
2. using jsreport in a node.js application
3. adapting jsreport on premise using node.js

So do you want to know where all the cool developers play? Go to [node.js section in the jsreport documentation](http://jsreport.net/learn/nodejs).

##node.js remote client for jsreport

jsreport has now dedicated [npm package](https://www.npmjs.org/package/jsreport-client) for working with reporting server from a remote node.js client. This means you can very easily render reports or even create report templates remotely from node.js. It works with every [on premise](http://jsreport.net/on-prem) or [reporting as a service](http://jsreport.net/online) based server.

You only need to install [jsreport-client](https://www.npmjs.org/package/jsreport-client) npm package, specify url of the server and then you are ready for rendering.

```js
var client = require("jsreport-client")(url, username, password)

client.render({
    template: {
	    content: "Hello world from remote jsreport!",
    },
}, function(err, resp) {
	//pipe pdf report to express.js response stream
	response.pipe(res);
});
```

If you are interested in details, see the [documentation for node.js remote client](http://jsreport.net/learn/nodejs-client).

## Using jsreport in a node.js application

jsreport has many functions node.js developers could be interested in. It can be for example fast html to pdf conversion or safe templating engines rendering. The problem was jsreport is very robust application with html studio and api what is something someone might don't want. To change this I have improved [jsreport npm package](https://www.npmjs.org/package/jsreport) with handy shortcuts allowing to use it in a very simple way. Html to pdf conversion is then just about downloading jsreport npm package and calling one function. Check it out...

```js
require("jsreport").render("<h1>Hello world</h1>").then(function(out) {
    //pipe pdf with "Hello World"
    out.result.pipe(resp);
});
```
You can find official documentation with other examples [here](http://jsreport.net/learn/pdf-reports-in-nodejs).

##Adapting jsreport on premise using node.js
jsreport is in the most of the cases adapted by editing [configuration file](https://github.com/jsreport/jsreport/blob/master/config.md). This is enough for some basic settings but it is not possible to provide for example some custom logging there. Because of this reasons I have done some changes to make it super simple to adapt jsreport directly using node.js. Everything is well documented and you can check it out [here](http://jsreport.net/learn/adapting-jsreport). Following example previews how you can edit `server.js` file and hook your own logger into jsreport.

```js
require("jsreport")
    .bootstrapper()
    .createLogger(function(bootstrapper) {
        return {
            info: function() {...},
            debug: function() {...},
            error: function() {...},
            warn: function() {...},
        }
    }
    .start();
```


