
{{{
    "title": "Release 2.10.0",
    "date": "09-07-2020 16:21"
}}}

**The jsreport 2.10.0 is here.**  

This is a rather smaller release which brings several nice features we wanted to ship to you before we move all of our focus to the jsreport v3 development. Let's look at the main highlights, the full release notes can be found on [github](https://github.com/jsreport/jsreport/releases) as always.

## Docx

The [docx](/learn/docx) recipe is becoming step by step one of the most important parts of jsreport. It already doesn't deserve the beta mark which we remove together with the v3 release.

The jsreport 2.10.0 brings improvements primarily for the `docxChart` helper which now supports many additional charts (waterfall, treemap, sunburst, funnel, stockChart, clusteredColumn, scatterChart, bubbleChart).

![bubble-chart](/blog/bubble-chart.png)

And also to the `docxTable` which can now render tables with dynamic columns or vertical tables.

![dynamic-table](/blog/dynamic-table.png)

## Pdf utils
There is always something that can be improved regarding pdf generation. This time we for example enabled specific pages removal using jsreport scripts.
```js
const jsreport = require('jsreport-proxy')

async function afterRender(req, res) {  
  res.content = await jsreport.pdfUtils.removePages(res.content, 1)
}
```

And thanks to the open source contribution, you can now add signatures to the pdf forms.

```
{{{pdfFormField name='test' type='signature' width='100px' height='50px'}}}
```

## Reports

We were asked [on the forum](https://forum.jsreport.net/topic/1605/public-version-of-download-link) to allow exposing stored reports to the public. This feature is now part of the jsreport 2.10.0. You just need to specify you want the report to be public in the rendering request call.
```js
 {
      "template": { "name" : "My template" },
      "data" : { ... },
      "options": {
          "reports": {  "save": true,  "public": true  }
      }
}
```

## Scheduling

The last feature from this release highlights was also [requested on the forum](https://forum.jsreport.net/topic/1584/scheduling-component-stressing-out-server-storage/3). The scheduling extension can now automatically clean the history to avoid performance problems with many schedules that runs very often.

```js
{
  "extensions": {
    "scheduling": {
      "cleanScheduleHistoryInterval": 60000,
      "maxHistoryPerSchedule": 10
     }
  }
```

## Conclusion
That's it. Enjoy the new features and let us know what you think. We will now focus on the jsreport 3 release. That will be the big one. Already looking forward. The scope isn't fixed, so don't hesitate to [submit a feature request](https://github.com/jsreport/jsreport/issues).