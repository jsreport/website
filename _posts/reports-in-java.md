{{{
    "title": "Reports in java",
    "date": "09-17-2020 15:06"
}}}

We are happy to announce **jsreport has the [java client](https://github.com/hedoncz/jsreport-javaclient) now.** The big thank you to the [hedonCZ](https://github.com/hedonCZ) who made this possible.

## Get started with java

### Install jsreport

The first you need to install jsreport server.  This can be as easy as this:
```sh
npm install jsreport-cli -g  
mkdir jsreportapp  
cd jsreportapp  
jsreport init  
jsreport configure  
jsreport start
```

or even simpler use [docker](/learn/docker):
```sh
docker run -p 5488:5488 jsreport/jsreport
```
For the details see the [installation manuals](/on-prem).

Now you can open jsreport on the default `http://localhost:5488` and prepare your first reports.
You can find the tutorials [here](/learn) if you are new to jsreport.

![studio](https://jsreport.net/screenshots/studio.png)

### Create java project

Now create a basic java project and use [maven](https://maven.apache.org/) to install [jsreport-javaclient](https://github.com/hedoncz/jsreport-javaclient) dependency.

```xml
<dependency>
	<groupId>io.github.hedoncz</groupId>
	<artifactId>jsreport-javaclient</artifactId>
</dependency>
```

### Render with java client

Then you can get the `JsReportService` interface and render the stored template.
```java
JsReportService reportingService = new JsReportServiceImpl("http://localhost:5488");
Report report = reportingService.render("invoice-main", myDydata);

Files.copy(report.getContent(), Paths.get("report.pdf"));
```
The data can be any serializable object or hashmap representing the input data of the report.

## Conclusion

I believe it was already a piece of cake for the java developers, to use jsreport [rest API](/learn/api). However, I also believe this new [java client](https://github.com/hedonCZ/jsreport-javaclient) makes the learning curve much shorter and the solutions less error-prone.

Please give it a try and let us know how you like it. If you are interested, the author happily accepts contributions and PRs.