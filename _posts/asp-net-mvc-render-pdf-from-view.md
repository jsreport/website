{{{
    "title"    : "Rendering pdf from Asp.Net MVC views",  
    "date"     : "03-20-2014 20:56"
}}}

>  **Download** example from [github](https://github.com/jsreport/net/tree/master/examples/Mvc)

We are excited to announce that we have just released [nuget package](https://www.nuget.org/packages/jsreport.MVC) allowing to render pdf from asp.net mvc views using jsreport platform. The idea in behind is very simple. Just grap the html that is rendered by the view, send it to jsreport server and let it transform into pdf using [phantomjs](http://phantomjs.org).


To get started you need to install `jsreport.MVC` package into your `asp.net mvc` project first.

> Install-Package jsreport.MVC

Then you need to add `JsReportFilterAttribute` to filters collection. This require access to jsreport server. You can use [.net embedded](http://jsreport.net/learn/net-embedded) or [on prem](http://jsreport.net/on-prem) or [jsreport online](http://jsreport.net/online) service. 
```c#
public static void RegisterGlobalFilters(GlobalFilterCollection filters)
{
  filters.Add(new HandleErrorAttribute());
  
  //when using .net embedded version you need to start server first
  EmbeddedReportingServer = new EmbeddedReportingServer();
  EmbeddedReportingServer.StartAsync().Wait();
  filters.Add(new JsReportFilterAttribute(EmbeddedReportingServer.ReportingService));

  //when using on prem or online just instantiate ReportingService with correct url
  //filters.Add(new JsReportFilterAttribute(new ReportingService("http://localhost:2000");
}
```
The last step is to enable particular controller or action to use jsreport for rendering. You will do this using `EnableJsReport` attribute.

```c#
[EnableJsReport()]
public ActionResult Index()
{
  ViewBag.Message = "Modify this template to jump-start your ASP.NET MVC application.";
  return View();
}
```

And now you can try to visit the page and it should open a pdf instead of html.

jsreport will evaluate all your css files and even javascript. You only need to keep in mind that every resource like script or style has to be linked with absolute url.

####Quick notes for more sophisticated scenarios.

If you want to add headers and footers to your page, look at the additional parameters of the `EnableJsReportAttribute`.

For more sophisticated scenarios you can inherit from the `JsReportFilterAttribute` and override `RenderReport` method.

For more informations see source codes on [github](https://github.com/jsreport/net/tree/master/examples/Mvc).
