{{{
    "title"    : "jsreport for c# reached 1.0",  
    "slug"     : "jsreport-for-csharp-reached-1-0",
    "date"     : "08-03-2016 15:20"
}}}

I'm happy to announce we just released major improvement in jsreport c# integration. All nuget packages are now ready to be downloaded.

[jsreport.Client](https://www.nuget.org/packages/jsreport.Client/)    
[jsreport.Embedded](https://www.nuget.org/packages/jsreport.Embedded/)    
[jsreport.MVC](https://www.nuget.org/packages/jsreport.MVC/)    

The new release brings the latest features from jsreport also into the .NET and Visual Studio. More over we dramatically reworked the way how is the jsreport integrated. Lets take a look what has changed.

###Always the latest jsreport
[jsreport.Embedded](https://jsreport.net/learn/net-embedded) now always installs the latest jsreport from npm and pack it into single `jsreport.zip` during the nuget install. This means we don't have to always release `jsreport.Embedded` in parallel and the package will be always up to date.

Additionally the [jsreport.Embedded](https://jsreport.net/learn/net-embedded) package makes it really easy to install additional jsreport extensions or change the configuration. You can for example quickly install [electron-pdf](https://github.com/bjrmatos/jsreport-electron-pdf) recipe and use chrome based pdf rendering. There is no need for complicated extracting/compressing anymore.

###Visual Studio extension dropped
The jsreport Visual Studio extension became to be difficult to maintain due to the extensible nature of jsreport.  We had to maintain one standard jsreport html based studio and in parallel also the VS extension. This turned out to be bad idea because there were new extensions and features coming to jsreport studio every week.

The VS extension now won't work with the latest jsreport nuget packages and you should use the standard html based jsreport studio instead. The same applies for the `*.jsrep` files provided by the extension. You should now use the templates stored by jsreport instead. See the [docs](https://jsreport.net/learn/net-embedded) for details.

###Conclusion
This release tightly converges jsreport with c# integration and makes it more transparent. It also brings promise from us to support it more than it was until now. The update to the latest nugets can cause minor headaches if you need to migrate many templates from `*.jsrep` files, but it is definitely worth it. 

