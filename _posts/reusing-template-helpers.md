{{{
    "title"    : "Reusing template helpers",	
    "date"     : "02-27-2016 14:39"	
}}}

The common problem... I have many report templates using various templating engine helper functions, but many of them are actually the same and I'd like to share them across different templates. Not just copy paste them every time I create a new template. There is simple solution using [custom script](/learn/scripts)....

Create a new script and define helper functions you'd like to share.  Override `beforeRender` function and concatenate helper functions into `request.template.helpers`.
```js
function helperA() {
  return 'A';
}

function helperB() {
  return 'B';
}

function beforeRender(done) {
    request.template.helpers += '\n' + helperA + '\n' + helperB;
    done();
}
```

Associate this script into every template where you would like to use shared helpers. And that is it, now you can access the helpers as it would be defined directly in the helpers tab.

```html
{{:~helperA()}}
{{:~helperB()}}
```
