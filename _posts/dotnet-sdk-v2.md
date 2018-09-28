
{{{
    "title"    : ".NET sdk v2",
    "date": "09-28-2018 13:30"
}}}





jsreport .NET sdk v2 is here.

We finally updated the jsreport sdk binaries to match the latest jsreport v2 release. The v2 is major release with breaking changes and you will need to adapt your application code to be able to update.

You can see the original jsreport v2 announcement [here](https://jsreport.net/blog/jsreport-v2-released). The most significant change is replacement of [phantomjs](/learn/phantom-pdf) with [chrome](/learn/chrome-pdf). This has impact on the .net APIs and you will mainly need to replace the `PhantomPdf` recipe enum with `ChromePdf`. Note the phantomjs and chrome produces a bit different sizes in pdf and you may need to adapt your templates as well.

```csharp
var rs = new LocalReporting()
	.UseBinary(JsReportBinary.GetBinary())
	.AsUtility()
	.Create();

var report = await rs.RenderAsync(new RenderRequest()
{
    Template = new Template()
    {
	    // !!! v2 includes by default ChromePdf recipe instead of PhantomPdf
        Recipe = Recipe.ChromePdf,
        Engine = Engine.None,
        Content = "Hello from pdf"
    }
});
```