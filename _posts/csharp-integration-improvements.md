{{{
    "title"    : "c# integration improvements",  
    "slug"     : "csharp-integration-improvements",
    "date"     : "05-23-2016 11:56"
}}}

> Update: [c# integration reached 1.0](https://jsreport.net/blog/jsreport-for-csharp-reached-1-0)

In parallel to works on jsreport@1 release we are also improving integration with .NET and c#.

Through time we traced the following problems with them:

1. It is tedious to always release new jsreport.Embedded nuget when there is new jsreport version available
2. Installing new extensions and recipes to the jsreport.Embedded is cumbersome, because it requires to unzip, install and zip back the embedded installation
3. There are still issues with running jsreport.Embedded node process in parallel to multiple application pools and workers in IIS
4. Visual Studio extension only supports additional attributes for one recipe (phantom-pdf). It is difficult to maintain all other recipes options inside VS extension
5. Visual Studio format for report templates, images and data just duplicates the format used in [jsreport](https://github.com/jsreport/jsreport-fs-store/)

To overcome the mentioned reason we decided to rework the jsreport.Embedded approach. Today we're shipping the beta version in nuget package [jsreport.Local](https://www.nuget.org/packages/jsreport.Local) and I'm going to show now how does it work and why it is better than the jsreport.Embedded.

##Installation of jsreport.Local

After installation you'll find out that several files have been added to the solution. Additionally to the sample report, you'll find also several configuration files and scripts which helps you to adapt jsreport.

You can also see that the local jsreport instance has been downloaded from npm into `jsreport/development` folder and that it was automatically zipped for production deployment into `jsreport/production/jsreport.zip`


![net-solution](https://jsreport.net/blog/net-solution.png)

##Report development

The first step is to run the file `start-local.cmd`. This will start the local jsreport instance you'll use to develop the report templates. Afterwards you should be able to reach the jsreport studio at http://localhost:3000

My favorite approach now is to open the browser with jsreport studio on one screen (or on one half) and Visual Studio on the second one. Then navigate to the sample template in both VS and studio and try to edit it in the VS. You should see that jsreport automatically monitors changes made in VS studio and refreshes the report output.

![net-local](https://jsreport.net/blog/net-local.gif)

This way you can use VS together with jsreport without any VS extension involved and also stick with native jsreport template format. You only need to make sure that all the files you have in `jsreport/reports` have enabled `Copy to Output Directory` in the properties.

##Production rendering
There is nothing that need to be done for production publishing or deployment. VS should automatically copy the `jsreport\production` folder as well as `jsreport\reports` folder to the bin and this is enough.

Invoking the report rendering from c# is then simple as follows.

```cs
var rs = new LocalReportingService();
rs.Initialize();    

//render the report with name "Sample report"
//and pass the input data in anonymous object
var result = rs.Render("Sample report", new { foo = "hello" });             
```

Alternatively you can use the override which accepts single object completely describing the rendering request.  You can find how this object should look like in the jsreport studio [API dialog](https://jsreport.net/learn/api) or for example [here](https://github.com/jsreport/jsreport-core)

```cs
var result = rs.Render(new {
	template = new {
		name = "Sample report"		
	},
	data = new { }
});   
```

Note that initialization of `LocalReportingService` can take a while for the first run because it needs to unzip the `jsreport.zip`.  Also note `LocalReportingService` doesn't start any web server as it was with `jsreport.Embedded`. It simply starts node and output report every time you call render. This should make it reliable and also fast enough.  

##Installing additional extensions

1.
Navigate to `jsreport/development` and run
```sh
"../../.bin/npm" install jsreport-wkhtmltopdf
```

2.
Edit `jsreport/development/prod.config.json` and add `wkhtmltopdf` into the `extensions` array

3.
Edit `jsreport/production/prod.config.json` and add `wkhtmltopdf` into the `extensions` array

4.
Navigate to `jsreport` and run
```sh
pack-production.cmd
```

Now you can use [jsreport-wkhtmltopdf](https://jsreport.net/learn/wkhtmltopdf) in both development studio and production run.

##Summary
[jsreport.Local](https://www.nuget.org/packages/jsreport.Local/) brings to c# and VS more flexible and more transparent reporting than it was with [jsreport.Embedded](https://www.nuget.org/packages/jsreport.Embedded). You should be able to easily use the whole power of jsreport and custom extensions in more reliable way. Please note this is just pre-release. We would love to get a feedback from you now.



