{{{
    "title"    : "Freeze template editing",  
    "date"     : "12-03-2015 21:30"
}}}

Sometimes it can be very useful to quickly update jsreport template through the studio on the production instance and fix the output reports. On the other hand accidental incorrect update of the template can also break the production report generation. To prevent these accidental updates we ship the new extension [jsreport-freeze](https://github.com/jsreport/jsreport-freeze).

Using `jsreport-freeze`  you can easily block all all the templates' updates and make sure nobody breaks the production instance. This editing freeze can be applied through common jsreport configuration.

```js
{
	"freeze": {
	  "hardFreeze": true
	}
}
```

Or even through jsreport studio action:

![freeze](https://jsreport.net/blog/freeze.gif)


Installation to jsreport is done through npm as usual

> npm install jsreport-freeze

See more information in the github repository [jsreport-freeze](https://github.com/jsreport/jsreport-freeze).