
{{{
    "title": "jsreport 4.0.0 release",
    "date": "08-30-2023 09:04"
}}}

We've released jsreport 4.0.0 today. Unlike the previous major releases, this one isn't loaded with tons of new features. But it addresses security concerns revealed in jsreport dependency [vm2](https://github.com/patriksimek/vm2) which jsreport uses for user code sandboxing. The library has critical security issues that the authors aren't able to solve keeping the same sandboxing approach and thus decided to stop the project. We had worked hard to come up with a solution in a relatively short timeframe which we fortunately did. The jsreport 4.0.0 doesn't depend on insecure vm2 dependency and applies a different secure sandboxing approach. The downside is that in some cases the new sandboxing may require user code changes. That is why we decided to release this version as a major to highlight that you may need to update your templates to successfully run the jsreport v4.

The good news is that the majority of the jsreport deployments run just internally developed templates and don't use sandboxing and `vm2`. You can easily find out by checking config `trustUserCode`. **If the `trustUserCode` is `true`, you aren't affected.** You can update to v4 without code changes, but you as well don't need to because you don't use the insecure `vm2` dependency.

Those that rely on code sandboxing because they run potentially dangerous templates developed by external users will need to tests templates properly before going to production with v4. The new sandboxing approach uses [Secure EcmaScript shims](https://github.com/tc39/proposal-ses) which blocks javascript insecure operations and switch javascript into safe sandbox environment. In such environment, the user code can't do "ugly" things like changing global object prototypes. 

For example, the following code will throw error `Cannot assign to read only property 'toString' of object [object Number]` in v4.
```js
Number.prototype.toString = function () {
   return "hello"
}
```

This isn't common code, but you may have problems when using some legacy code that will need changes. But again, this applies only when `trustUserCode=false`. An alternative solution is to use the jsreport [docker workers](https://jsreport.net/learn/docker-workers) extension which sandboxes code in containers. There you can use `trustUserCode=true` and still safely evaluate external templates.

Please check [jsreport release notes](https://github.com/jsreport/jsreport/releases) to get further details. Note If you plan to update from jsreport v2 to jsreport v4, please update the first to v3 so the migrations scripts run properly.