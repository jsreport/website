
{{{
    "title"    : "jsreport v3 beta released",      
    "date"     : "08-18-2021 14:32" 
}}}


After almost a year of work, we can finally share with you jsreport v3. 
At this moment, it's marked as a beta, and it isn't production-ready.
However, we encourage you to try it out and look at the jsreport future.

## Installation

The v3 beta can be installed the following way. Note you need to use minimal [node.js 14](https://nodejs.org/).

```bash
npm install @jsreport/jsreport-cli -g
mkdir jsreportapp
cd jsreportapp
jsreport init beta
jsreport configure
jsreport start
```

You can also find the updated instructions at the [download page](/on-prem) when switching to "Try v3 beta".
The application should just start also with your existing data, however, we don't have all the migration steps covered yet and at this moment it is at your own risk.

## Highlights

### Profiler
The first goal of the jsreport v3 is to improve the developers' productivity. 
We noticed many developers struggling with localizing complex report timeouts and other error sources.
This motivated us to better track all the report rendering steps and visualize these in the jsreport studio.

![profiler](/img/blog/v3-profiler.png)

This is a very powerful feature!
- the running request is displayed in real-time, you don't need to wait to see the logs and what is happening until it finishes
- it visualizes the particular step which is failing and allows you to automatically open the errored line in your source codes
- every step displays how much time it took to process so finding the bottle-neck is now much easier
- you can download individual results of child templates to analyze, for example, the content before the pdf utils merge
- you can click the lines before the steps and display the step inputs
- the profile can be downloaded and shared with other developers for troubleshooting
- studio has an extra profiler use-case to monitor running requests and display its profiles

See the details in the [studio documentation](/learn/studio?version=3.0.0)

### Components
The v3 ships with the new `components` extension which should add the last missing piece into the problem of big templates decomposition.
Unlike assets, the component consists of templating engine content and helpers. This means you can extract both relevant parts of the templates (templating engine code + helpers)
into components and reuse these. The component is invoked directly from the templating engine with the current context so the decomposition looks very natural.

```
{{#each customers}} 
  {{component "./customer"}}
{{/each}}
```
See the details in the [components documentation](/learn/components?version=3.0.0)

### File System Store Cluster
The default file system store is improved in v3 to fully support running in a cluster consisting of multiple jsreport instances.
The v2 had to rely on the buggy files monitoring, but the v3 implements consistent journal distributing the changes across instances.

### Localization extension
The v3 ships with the `localization` extension and removes the `resources` extension. The purpose is the same - localize texts.
The new extension is based on the folders and assets which makes its usage more straightforward.
You simply create a folder named `localization` and put inside assets `en.json` and `de.json` with localized key-value pairs.
Then you can use templating engine helpers to reach the values for the input language. 

```html
<h1>Locallized message: {{localize "hello" "localization"}}
```

See the details in the [localization documentation](/learn/localization?version=3.0.0)

### Templates creation wizard
The templates creation usually requires many clicks in the studio to shape it to the desired needs.
We tried to make this faster for you and easier for the new jsreport users by implementing the "new template wizard".

![wizard](/img/blog/v3-wizard.png)

### SQL stores and blobs
jsreport v3 starts using [blob storages](/learn/blob-storages?version=3.0.0) much more now. The blobs, unlike entities, aren't visible in the studio and jsreport uses them for persisting bigger content like [output reports](/learn/reports?version=3.0.0). The v3 now uses blobs also for storing report profiles for debugging or version control diffs.
This motivated us to include blobs support also into all our SQL stores. 
All jsreport stores now support also blob storage by default so there is no need for extra configuration and the blobs will be properly persisted in your databases.

### Child templates syntax
Bringing the async support to the templating engine gave us great new opportunities to implement features with helpers that weren't possible before.
One of the things we had to solve differently using extra syntax was the child templates rendering.
The v3 now brings a much more convenient way of calling child templates using the templating engine helper.
This isn't just a syntax change, but it is wired into the templating engine evaluation. This means it also gets the current context.
```
{{#each students}}
  {{childTemplate "student"}}
{{/each}}
```

The child templates `{#child}` syntax is still supported to void dramatic rewrites of existing entities.

See the details in the [child templates documentation](/learn/child-templates?version=3.0.0)

### Assets improvements
The same thing with syntax happened to assets. Just use the templating engine helpers.
```
<style>
  {{asset "mainTheme.css"}}
</style>

<img src="{{asset "/shared/logo.png" "dataURI"}}" />
```

The assets additionally support extra API for templating engine helpers and also for jsreport scripts.
The helpers stored in an asset can be conveniently registered the following way

```js
const jsreport = require('jsreport-proxy')
await jsreport.assets.registerHelpers('myHelpers.js')
```

And a custom code implemented in an asset can be also "required" like this:
```js
const jsreport = require('jsreport-proxy')
const myModule = await jsreport.assets.require('myModule.js')

myModule.myFn()
```

See the details in the [assets documentation](/learn/assets?version=3.0.0)

### Worker threads
The second goal of the jsreport v3 is to improve the performance. 
jsreport is a mature framework with already very wide features scope so this was the right time to invest a lot into performance even for minor improvements.

Since the very beginning, this means for the last 7 years, jsreport processes the user code like scripts or templating engines in a separate process.
This is a must to avoid the main process freezing when a bad user code is evaluated, however, it also requires many transfers between the heavy main process and lightweight processes evaluating the user code. The transfers are typically cheap, however, it becomes a problem when the input data are big. 
These costly transfers resulted in extra configuration options allowing to run everything in a single process with the downside of eventual process hanging.
In the end, the jsreport developer had a choice to have lower performance or lower stability. The jsreport v3 solves both problems at once.

We've decided to completely rework the jsreport architecture using recently introduced nodejs worker threads.
All the input data are forwarded to the thread at the very beginning without costly serialization/deserialization.
The whole request lives in the same thread which gives us the ability to better use caching techniques.
This results in great performance improvements especially for complex reports with big input data.
There is now no need for the in-process evaluation and the worker threads are now the default and only option.

### pdf utils snippets
Another developer's productivity feature is pdf utils snippets. 
Configuring the template to include a table of contents, headers or cover page can be a challenge without a lot of experience.
Not anymore with convenient snippets you can invoke right from the pdf utils configuration.

![pdf utils](/img/blog/v3-pdf-utils.png)

### npm scope and monorepo
We've decided to use npm `@jsreport` scope for publishing our packages. This means instead of the `jsreport-unoconv` you're going to use `@jsreport/jsreport-unoconv` when installing custom extensions. The reason for this change was that many people publish npm packages with `jsreport-` prefix and we wanted to mark our extensions with official support. Everything in `@jsreport` npm scope is from the jsreport team.

The second organization change v3 brings is that all jsreport repositories are now merged into [github jsreport/jsreport monorepo](https://github.com/jsreport/jsreport).
This makes it easier to maintain the whole project.

## Conclusion
Please give the v3 beta a try and let us know what you think. The [forum](https://forum.jsreport.net) is always a great place to discuss.
