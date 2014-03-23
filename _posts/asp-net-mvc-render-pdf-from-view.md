{{{
    "title"    : "Rendering pdf from Asp.Net MVC views",  
    "date"     : "03-20-2014 20:56"
}}}


We are excited to announce that we have just released [nuget package](https://www.nuget.org/packages/jsreport.MVC) allowing to render pdf from asp.net mvc views using jsreport platform. The idea in behind is very simple. Just grap the html that is rendered by the view, send it to jsreport server and let it transform into pdf using [phantomjs](http://phantomjs.org).


To get started you need to first install `jsreport.MVC` package into your `asp.net mvc` project.

> Install-Package jsreport.MVC

Then you need to add `JsReportFilterAttribute` attribute to filters collection.
```c#
public static void RegisterGlobalFilters(GlobalFilterCollection filters)
{
  filters.Add(new HandleErrorAttribute());
  filters.Add(new JsReportFilterAttribute(new ReportingService("https://playground.jsreport.net")));
}
```
And finally the last step is to enable particular controller or action to use jsreport for rendering. You will do this using `EnableJsReport` attribute.

```c#
[EnableJsReport()]
public ActionResult Index()
{
  ViewBag.Message = "Modify this template to jump-start your ASP.NET MVC application.";
  return View();
}
```

And now you can try to render first pdf using `jsreport`. Note that for production you will need to change reporting server url. When you are using [jsreportonline](http://jsreport.net/online) it will be something like:

```c#
new ReportingService("https://[youraccount].jsreportonline.net", "[youremail]", "[yourpassword]")
```

When you are using [jsreport on premise](http://jsreport.net/on-prem) it should be something like:

```c#
new ReportingService("https://[192.168.0.1]")
```

####Quick notes for more sophisticated scenarios.

jsreport will not be able to handle externaly linked private css files, but you can workaround this easily by rendering inline styles using partial views.

If you want to add headers and footers to your page, look at the additional parameters of the `EnableJsReportAttribute`.

When the default `phantom-pdf` recipe jsreport will use is not your choice. You can inherit from the `JsReportFilterAttribute` and override `RenderReport` method.

For more informations see source codes on [github](https://github.com/jsreport/net)
