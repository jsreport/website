{{{
    "title"    : "Template layouts",	   
    "date"     : "01-03-2017 18:25"	
}}}

Don't you like adding the same scripts, styles or headers to every template? Do you need something like master layout template? Here is the solution for you.

jsreport doesn't support template layouts out of the box, but you can easily reach the same goal using [assets](http://jsreport.net/learn/assets) and [scripts](http://jsreport.net/learn/scripts) extension.

The first lets create [asset](http://jsreport.net/learn/assets) which represents the master template.
```html
<html>
    <head>
    </head>
    <body>
        <h1>Header</h1>
        $$$
        <h1>Footer</h1>
    </body>
</html>
```

You see the html contains place holder marked with  `$$$` which will be used to replace the real template content.

The next step is to create a template which will be later embedded into the master asset. This can be for example `template 1`:

```html
<h1>Hello from template 1</h1>
```

Then we create custom [script](http://jsreport.net/learn/scripts) which will be used to pick up the master asset and replace its content with the template being just rendered.

```js
function beforeRender(req, res, done) {
    var layout = '{#asset layout.html @encoding=string}'
    req.template.content = layout.replace('$$$', req.template.content)
    done();
}
```

The last step is to link the script to the `template 1` or even better. Mark the script as global in the properties and let it run for every single template. The result can then look like this:

<iframe src='https://playground.jsreport.net/studio/workspace/HkM7PSFSl/15?embed=1' width="100%" height="400" frameborder="0"></iframe>

