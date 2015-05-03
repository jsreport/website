#How to write a custom extension

##Introduction
jsreport is built with extensibility in mind since the very start. Whole platform is build from many independent pieces called **extensions** which can be plugged or unplugged as needed. There is for example an extension allowing to store report templates or an extension for running custom scripts. The extensions are written same as the whole platform in javascript language. This article describes how you can write and plug in your custom extension. Such an extension can be then easily distributed through npm and help the community with solving typical tasks.

##jsreport.config.js
A jsreport extension can be stored anywhere in the application directory tree, but needs to contain specific file `jsreport.config.js` in it's root directory. This file defines the basic extension attributes like it's name, dependencies or main entry point.

```js
module.exports = {
  "name": "myCustomExtension",
  "main": "lib/main.js",
  "dependencies": [ "templates", "data", "scripts" ]
}
```
An extension needs to contain the server side code identified with the `main` attribute as the relative path to the javascript file. The client side code doesn't require any configuration in `jsreport.config.js`. The listed dependencies  currently only guaranties the order in which are extensions initialized.

##Server side

Extension's server side main entry point needs to export a function which is called during the initialization process. This function can accept two parameters. The first is an instance of `Reporter` which is kind of a facade covering whole jsreport. The second parameter is a plain object containing attributes from `jsreport.config.js` merged with options provided to the jsreport in the attribute with the same name as the extension.  

```js
module.exports = function (reporter, definition) {
    console.log("My custom extension is initialized.").
};
```

###Listeners and promises
jsreport core provides hooks into the most of the operations through event listeners. You just need to choose the desired listener and add your hook function.  Such a function can run in the synchronous way or return a promise when running in asynchronous way.

```js
reporter.validateRenderListeners.add("myCustomListener", function(req, res) {
	 console.log("Processing template " + request.template.name);
	 throw new Error("Invalid rendering requests!");
});
```

See the last chapter *Listeners reference*  for all listeners and documentation.

###Rendering pipeline
The most common scenario for custom extensions is to hook into the rendering process and adapt the inputs before the html is actually printed into pdf and so on.  This can be achieved by adding the function into `beforeRenderListeners`.

Quite often you want to execute your code just after the template is loaded but before the child templates are extracted. For this purpose you can use `insert` method on the listeners collection instead of `add`.  This method accept a condition as the first parameter in which you can specify more precisely

```js
reporter.beforeRenderListeners.insert({ 
		after: "templates", 
		before: "childTemplates" 
	}, "myCustomExtension", this, function(req, res) {
	req.template.content = "<p>" + req.template.content + "</p>";
});
```

###Document store

##Client side

##Distributing extension

##Listeners reference

client side