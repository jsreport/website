{{{
    "title"    : "jsreport v2 beta",	   
    "date"     : "03-28-2018 15:20"	
}}}

The jsreport v2 release is almost ready and we ship today the first beta version to the public. It is not production ready and we are still finishing some fixes in the migration utility, documentation and custom extensions. However it should be already stable enough for start working with it in the development environment.

How to install..
```
npm i -g jsreport-cli
jsreport init 2.0.0-beta
jsreport configure
jsreport start
```
Or using docker
```
docker run -p 5488:5488 jsreport:2.0.0-beta
```

jsreport v2 is major release which includes many improvements and also several breaking changes. The biggest change is replacement of  [phantomjs recipes](/learn/phantom-pdf) with [chrome based recipes](/learn/chrome-pdf) in the default installation. Please refer to the list of [breaking changes](/learn/v2-breaking-changes) for details.

We will officially announce final jsreport v2 release as soon as we get a confidence about the production stability of the beta releases. The detail description of the new features should come at the same time.

Please try the beta and let us know how you like it.

