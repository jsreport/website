{{{
    "title"    : "Using local scripts and other resources",	
    "date"     : "02-27-2016 16:20"	
}}}

Since jsreport@0.13 it is quite easy to `require` or reach local scripts or files. This was actually possible all the time however it was a bit difficult to correctly combine the path to the local resource. This is now fixed.

Lets assume you have somewhere in you application file `helperA.js` you would like to use in the template's helper...

At the very beginning you need to first opt in and allow the module require in the settings `tasks.allowedModules`. The expected value is an array of unblocked modules or simply `"*"` if you just want to allow every `require` call.

```js
{
    "tasks": {
      "allowedModules": "*"
    }
}
```
Then create `helperA.js` in the root of your application.

```js
module.exports = function() {
  return 'Hello world';
}
```

And now you should be able to `require` this module inside your helper functions.
```js
function helperA() {
	require('helperA.js')()
}
```

How the `require` finds your script? The standard nodejs require searches in several folders for the required script. jsreport additionally extends this with path to the application root and also to the directory from which jsreport was initialized and started. This way it assembles the full absolute path to your script and requires it. This is all provided in the single `require` call.

What if you don't want to call `require` but rather read the file from the disk using `fs` module? To fulfill this jsreport extends the global scope with following variables:

`__rootDirectory` - two directories up from jsreport<br/>
`__appDirectory` - directory of the script which is used when starting node<br/>
`__parentModuleDirectory` - directory of script which was initializing jsreport-core

You can then use this variables to combine the full path to your local resources inside helpers or also [custom scripts](/learn/scripts)...
```js
var path = require('path');
var fs = require('fs');

var data = fs.readFileSync(path.join(__appDirectory, 'resources/myResource.json'));
```