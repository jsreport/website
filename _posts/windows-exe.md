{{{
    "title"    : "Windows exe",
    "date"     : "08-30-2015 15:23"
}}}

I was hoping for a while that one day jsreport is distributed in the form of single executable file in parallel to common [npm](https://www.npmjs.com/package/jsreport) distribution. This would simplify some of the on premise deployments scenarios where every dependency like npm matters. Unfortunately there is no such a technology which would allow us to compile node.js based jsreport into single exe. The existing compilation technologies doesn't work well with jsreport architecture. The file system virtualization technologies which would help in this case are on the other hand too slow. So there is no go for jsreport to currently run just as a single file in the memory. However I didn't completely abandon the idea of  `jsreport.exe`, because virtualizing file system calls or compiling javascript may not work, but to have an exe file which automatically extracts whole node application at the first run and starts node is trivial.

So starting today we distribute jsreport also in the form of a single `jsreport.exe`  which can be simply used in the windows command line. The `jsreport.exe` doesn't have any dependency except .net runtime and it should fit into various deployment scenarios.

First you  [download](/on-prem)  `jsreport.exe` and then...

Start jsreport server on the default port:
>jsreport.exe

Or invoke a single rendering request without starting the server
>jsreport.exe --render request.json --output report.pdf


See the [documentation](/learn/windows-single-executable) for details.