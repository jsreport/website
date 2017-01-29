
{{{
    "title"    : "jsreport release 0.1.0",  
    "date"     : "05-10-2014 11:01"
}}}

After a month we are shipping new major release of jsreport. This release is mostly about bug fixing and updating integrated editor.  See the highlights of version 0.1.0.

##New editor
jsreport now uses [Ace](http://ace.c9.io/) editor instead of [CodeMirror](http://codemirror.net/). New editor is way more powerful and fits much better into jsreport.

First improvement you will mention is highlighted handlebars and jsrender tags:

![handlebars](https://jsreport.net/img/blog/handlebars-highlight.png)

Another great feature is code validations:

![validations](https://jsreport.net/img/blog/validations.png)

Third feature but deffinetely not the last one is intellisense. Press `ctrl+space` and check out intellisense pop up.

![intellisense](https://jsreport.net/img/blog/intellisense.png)

##Modified helper functions syntax
Another important change is a new style of writing helpers. Helper functions should be now declared as global functions. This is same for both jsrender and handlebars. 

```javascript

function helper1(para, parb) {
    ....
}

function helper2(options) {
    ...
}

```

The old object based syntax is still supported but it should be avoided. 

##Hot keys
Another improvement in usability is support for hot keys in jsreport. Now you can type `ctrl+s` to save template or press `F8` to preview report.