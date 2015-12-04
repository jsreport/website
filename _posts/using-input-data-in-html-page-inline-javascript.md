{{{
    "title"    : "Using input data in html page inline javascript",  
    "date"     : "12-04-2015 21:59"
}}}

> **Example in [playground](https://playground.jsreport.net/#playground/-kVmc8tS5x/5)**

In jsreport, templating engines are used to dynamically construct report html based on the input data. This is quite straight forward. 

But when you need to use templating engine to pass the input data into page's inline javascript, you realize it doesn't work out of the box:

```html
<script>
    //error, javascript templating engines produces object, not the json definition
	var inputParameters = {{{data.paramenters}}}
</script>
```

The problem is javascript templating engines are producing objects, not the JSON object definitions. To solve this you can use the little trick.

##Solution

Define helper function which makes JSON string from the parameter

```js
function toJSON(data) {
  return JSON.stringify(data);
}
```

And call this helper in inline script

*handlebars*
```html
<script>
	var inputParameters = {{#toJSON data.parameters}}{{/toJSON}}
</script>
```

*jsrender*
```html
<script>
	var inputParameters = {{:~toJSON(data.parameters)}}
</script>
```

