{{{
    "title"    : "jsreport toner for node.js",
    "date"     : "06-10-2015 19:52"
}}}

jsreport can be very easily integrated into the node.js application, but for some simple use cases it is too heavy. Sometimes you just want to quickly render the html with javascript helpers and produce pdf. Sometimes you don't want a jsreport studio nor storing the templates. To better fit these simple use cases I have extracted the rendering part from jsreport and made a dedicated [npm package](https://www.npmjs.com/package/toner) from it.

**Introducing jsreport toner ...**

[jsreport toner](https://github.com/jsreport/toner)  is a report rendering engine powering jsreport under the hood. It is very lightweight library which requires only couple of lines to initialize and render a report:

```js
var toner = require("toner")();
toner.engine("jsrender", require("toner-jsrender"));
toner.recipe("wkhtmltopdf", require("toner-wkhtmltopdf")());

toner.render({
    template: { 
        engine: "jsrender",
        recipe: "wkhtmltopdf", 
        content: "<h1>{{:foo}}</h1>"
    },
    data: { foo: "hello world"}
}, function(err, res) {
    var pdfbuffer = res.content;
    var pdfstream = res.stream;    
});
```
It is a completely separate part but you see it uses the same terminology of engines and recipes so you should quickly understand the concept when already using jsreport. See the [github page](https://github.com/jsreport/toner) for full documentation.
 
Nothing is changed for jsreport, extracting toner into separate package was just a refactoring. jsreport is still a complete solution for reporting including web server, designer and template storage where jsreport toner is just a library capable of rendering reports.

To better orient in the npm packages and github repositories I established following conventions:

- packages plug-able to toner are prefixed with `toner-*`
- packages plug-able to jsreport as extensions are prefixed with `jsreport-*`

If you check the source of the [jsreport-wkhtmltopdf](https://github.com/jsreport/jsreport-wkhtmltopdf) you find it is conveniently using [toner-wkhtmltopdf](https://github.com/jsreport/toner-wkhtmltopdf) so there is no code duplication. However this is not required. There can be standalone jsreport extensions and recipes. It is up to you as contributor to decide if you create your recipe just for jsreport or you provide it as well for toner.