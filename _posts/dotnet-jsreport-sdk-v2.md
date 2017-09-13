{{{
    "title"    : ".NET jsreport sdk v2",  
    "date"     : "09-13-2017 10:58"
}}}

I would like to take a chance and introduce the latest v2 update to [.NET jsreport sdk](/learn/dotnet). This major update includes a new way of running jsreport in .NET, better handling of jsreport type system and also support for .NET Core.

## jsreport.Local
Not long a go we started to ship jsreport also in compiled [single executable file](/blog/one-file-one-executable-whole-jsreport) distribution. It is now very easy to download `jsreport.exe`, save it somewhere and simply run the reports rendering or even whole reporting server. It has some limitations compared to fully installed jsreport, but the easiness of installation is on the side of `jsreport.exe`. This distribution is also much easier to embed into third party applications. So we decided to create nugets which embeds this distribution in the assembly manifest and wrap its execution with nice c# API. 

The long story short... rendering pdf using jsreport in .NET, after installing `jsreport.Local` and `jsreport.Binary` nugets looks now as simple as this:

```csharp
var rs = new LocalReporting().UseBinary(JsReportBinary.GetBinary()).AsUtility().Create();

var report = await rs.RenderAsync(new RenderRequest()
{
    Template = new Template()
    {
        Recipe = Recipe.PhantomPdf,
        Engine = Engine.None,
        Content = "Hello from pdf"
    }
});
```

This new API includes fluent syntax for configuring jsreport and also methods to start jsreport as http server including the browser based reporting studio. It doesn't pollute your project with additional files because everything is compiled in the `jsreport.Binary` manifest and you can just concentrate on report rendering. 

## .NET Core
All packages released in the latest [.NET jsreport sdk](/learn/dotnet) supports both full .NET framework runtime as well as [.NET Core](https://www.microsoft.com/net/core). You can use nugets manager to install them and everything gets resolved correctly. The packages are in fact distributed as [.NET Standard](https://docs.microsoft.com/en-us/dotnet/standard/net-standard) libraries so there should be no problem with compatibility for example on linux.

## ASP.NET
We shipped new [jsreport.AspNetCore](https://jsreport.net/learn/dotnet-aspnetcore) package with filters that allows you to pipe Razor views through jsreport recipes to the user. This is the same approach as originally introduced in  [jsreport.MVC](https://jsreport.net/learn/dotnet-mvc) which only support full framework.

The improved API now includes fluent syntax for configuring the request right from the controller. The usage a bit differs between the ASP.NET Core and ASP.NET MVC running full framework, but the changes are minor. 

```csharp
// jsreport.AspNetCore usage
[MiddlewareFilter(typeof(JsReportPipeline))]
public IActionResult Invoice()
{
    HttpContext.JsReportFeature().Recipe(Recipe.PhantomPdf);
    return View();
}
```

```csharp
// jsreport.MVC usage
[EnableJsReport()]
public IActionResult Invoice()
{
    HttpContext.JsReportFeature().Recipe(Recipe.PhantomPdf);
    return View();
}
```

## Type system
We decided to map all jsreport entities into strong c# types to provide more comfortable development and IntelliSense. This mapping is part of [jsreport.Types](https://github.com/jsreport/jsreport-dotnet-types) package and its version always correspond to the jsreport version itself. This assures that you can still use an older jsreport binary or server, but in the same time use the latest c# API.

This change has unfortunately breaking impact on the most of the existing implementations. However there is no need to panic, you mostly only need to uper case the old properties and link some namespaces. The IntelliSense should help with it.

## jsreport.Embedded
We've currently put on hold the package [jsreport.Embedded](https://www.nuget.org/packages/jsreport.Embedded/) and haven't updated it to the latest changes in .NET jsreport sdk. The reason is that we think that [jsreport.Local](/learn/dotnet-local) solves the problem of embedding jsreport into .NET in the better way. We currently wait for a feedback and decide about maintaining it futher based on it.

## Videos, tutorials, examples

.NET jsreport sdk has the new [documenation portal](https://jsreport.net/learn/dotnet) which contains links to examples, further reading and also quick [introduction video](https://www.youtube.com/watch?time_continue=584&v=qqTGQgkEHow). 

The contributors could be interested in the new github [home repository for .NET jsreport sdk](https://github.com/jsreport/jsreport-dotnet). It contains links to all the repositories involved with build statuses and the latest nuget versions. Note that the sdk is still MIT licensed and everyone is welcome to contribute.




