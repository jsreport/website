{{{
    "title"    : "Introducing jsreport-core",
    "date"     : "12-11-2015 11:25"
}}}

In the [previous post](/blog/every-extension-has-its-own-repository) I described how is the jsreport structured since the 0.10 release. In this post I show how the developers can benefit from the new structure and how the full power of jsreport can be used in the lightweight form in nodejs applications.

**Introducing jsreport-core...**

[jsreport-core](https://github.com/jsreport/jsreport-core) is the minimalist dynamic document rendering core powering jsreport. The main concepts like document assembling using [javascript templating engines](/learn/templating-engines) or document printing using [recipes](/learn/recipes) is the same as for full jsreport. Even the API is the same. The difference is that [jsreport-core](https://github.com/jsreport/jsreport-core) is really lightweight and to render a document you usually need to plug one or more extensions which are usually adding engines or recipes.

For the start you can try to print a pdf using [phantom-pdf](https://github.com/jsreport/jsreport-phantom-pdf) recipe. Lets also plug [jsrender](https://github.com/jsreport/jsreport-jsrender) engine and use it to dynamically construct html.
```js
var jsreport = require('jsreport-core')();
jsreport.use(require('jsreport-phantom-pdf')());
jsreport.use(require('jsreport-jsrender')());

jsreport.init().then(function () {     
   jsreport.render({ 
       template: { 
           content: '<h1>Hello {{:foo}}</h1>', 
           engine: 'jsrender', 
           recipe: 'phantom-pdf'
        }, 
        data: { 
            foo: "world"
        }
    }).then(function(resp) {
     //prints pdf with headline Hello world
     console.log(resp.content.toString())
   });
}).catch(function(e) {
  console.log(e)
});
```

Do you want to use different pdf printing method or build excel, html or csv? Just install a different recipe, there are already [plenty of them](https://github.com/jsreport/jsreport-core#recipes). The same applies for templating engines. Do you rather like [handlebars](https://github.com/jsreport/jsreport-handlebars) ?  `jsreport-core` can handle it as well, see the full list of [supported engines](https://github.com/jsreport/jsreport-core#engines).

This can go even further, because every [extension](/learn/extensions) supported by jsreport can be used with `jsreport-core`. This also includes the jsreport studio designer!

To see it in action you can for example create your own express application and run jsreport studio on the subpath.

![core](https://jsreport.net/blog/core.gif)

```js
var jsreport = require('jsreport-core')();
var express = require('express');

var app = express();

app.get('/', function (req, res) {
  res.send('Hello from the main application');
});

var reportingApp = express();
app.use('/reporting', reportingApp);


jsreport.use(require('jsreport-express')({app: reportingApp}));
jsreport.use(require('jsreport-phantom-pdf')());
jsreport.use(require('jsreport-jsrender')());
jsreport.use(require('jsreport-templates')());


app.listen(3000);
jsreport.init();
```

Applying more extensions you get more features in the studio. In the final case you can get the same power as the full distribution of jsreport, but in that case you likely rather want to use the official jsreport package.

The last note is about the `jsreport-core`  and [toner](https://github.com/jsreport/toner) ambiguity.  Both packages are solving the same problem. The difference is that `jsreport-core` offers more and is in fact superset of [toner](https://github.com/jsreport/toner).  We recommend you to use rather the `jsreport-core` package. It support more functionalities, more recipes and more engines with more active development. 