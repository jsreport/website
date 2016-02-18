{{{
    "title"    : "Running scripts and helpers in main process",	
    "date"     : "02-18-2016 20:06"	
}}}

jsreport now supports the third strategy for running scripts and helpers. Just to remind you the strategy is specified in the `tasks.strategy` option and the first two are:

- `dedicated-process` (default) - run each script and template compilation in dedicated node process and communicate with the main one through node messages
- `http-server` - avoid starting node processes over and over and rather reuse them, this is provided through multiple worker processes communicating with the main one through http calls

The third one which is now provided in the latest jsreport release is called `in-process` and the name says pretty much everything. It simply runs the scripts and helpers directly in the same process as everything else. This has three benefits.

1. The fastest strategy because there is no cross process communication needed
2. No issues with large data amounts transfered between processes
3. Passing helper functions directly to the rendering as native javascript objects works

The first and second benefits are quite obvious, but the third one is more interesting. If jsreport needs to pass helpers to the external process it always need to send it as string, there is no other way and that is why you cannot use jsreport node.js API with your local functions. However with `in-process` strategy it is possible to pass javascript object with helpers directly to the `render` method and it will work.
```js
var jsreport = require(jsreport);
jsreport.render({
  template: {
    content: '{{:~foo()}}',
    helpers: {
      foo: function() {
        return 'Yes, we can!'
      }
    },
    engine: 'jsrender',
    recipe: 'phantom-pdf'
  }
})
```

When this is so simple and so good why is this not provided since the start? Because this strategy is **NOT SECURE** for running users' custom report templates. If a helper contains an infinite loop and you use `in-process` strategy jsreport just completely freezes and the process restart is required. Keep this in mind and use this strategy only when you are sure the report templates are safe and well written. 
