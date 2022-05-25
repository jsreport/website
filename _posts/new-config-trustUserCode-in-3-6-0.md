

{{{
    "title": "New config trustUserCode in 3.6.0",
    "date": "05-25-2022 21:04"
}}}


**jsreport 3.6.0 among bug fixes and performance improvements brings a new configuration `trustUserCode` and deprecates the `allowLocalFilesAccess`.**

It is more like a rename of the config `allowLocalFilesAccess` to the `trustUserCode`, but I would like to elaborate more on what the change implies because it affects the core part of jsreport.

jsreport by default sandboxes user code preventing users to penetrate the sandbox with javascript known hacks or require custom nodejs modules. This makes sense for the secure default, but often, jsreport is used only internally by trusted developers who need to load custom modules and reach the local system. This led us to introduce the config allowLocalFilesAccess, a long time ago. It's used in the previously mentioned use-case by many many jsreport instances. While enabling `allowLocalFilesAccess` lets template developers reach custom modules or local systems, it keeps the user code sandboxed.  This means the user still can't use a javascript hack to leave the sandbox.

Lately, we realized that proper sandboxing brings some performance penalties we can't eliminate and decided to give you options to disable it. We give you this option now through config `trustUserCode` which disables the sandbox but also allows users to require modules and reach the local files. In other words, the `truserUserCode` is what used to be `allowLocalFilesAccess` but on top, it also disables sandboxing.

The `allowLocalFilesAccess` is now deprecated and behaves the same as `truserUserCode`. We have decided this change isn't breaking and released it as part of the minor release because when you give users access to the modules and files, they can do pretty much everything anyway and don't need to be sandboxed.

**When to enable `trustUserCode`?**    
When you trust users developing jsreport templates they don't have bad intentions.  However be very cautious, it opens a short path to reach your system.

**How much enabling `trustUserCode` improve performance?**    
This can't be predicted.
Most of the reports' performance bottleneck is chrome pdf printing on which has the `trustUserCode` no impact.
However, when you see a many seconds long evaluation of the templating engines, enabling `trustUserCode` could improve it.  

**What to do when updating to the jsreport 3.6.0 ?**    
Nothing to do, you can keep using the deprecated `allowLocalFilesAccess`. The application will behave like the `trustUserCode` is enabled.  

**What to do when the performance gain with enabled `trustUserCode` is important but you can't allow users to break the system?**    
You can guarantee secure execution through the virtualization. This can be achieved for example using jsreport extension [docker workers](/learn/docker-workers).
