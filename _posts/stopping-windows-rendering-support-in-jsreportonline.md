{{{
    "title"    : "Stopping windows rendering support in jsreportonline",      
    "date"     : "02-15-2022 08:13"
}}}


**On 26th April 2022 jsreportonline will stop supporting the windows based rendering.**    
(This date could be shifted to the future if there will be a strong demand) 

## Why do we do this?
- the technical solution of the windows rendering doesn't provide such isolation as the Linux so it has unpredictable performance.
- we carry the costs of additional windows servers for just a few last customers and the deprecation was announced 2 years ago.
- This step will help us to move forwards [jsreport v3](https://jsreport.net/blog/jsreport-v3-beta-released) in jsreportonline.

## Who is affected?
Everyone who uses [phantom-pdf](https://jsreport.net/learn/phantom-pdf) or [wkhtmltopdf](https://jsreport.net/learn/wkhtmltopdf) recipe and in the template's properties has selected the windows based version.

[jsreportonline](https://jsreportonline.net/) displays the list of the affected templates in the modal every time you log in. This notice is present in the jsreportonline already for 2 years. If you don't persist the templates in the studio, but send the templates content in the API calls, please continue [below](#template-content-in-api-call).

## How to migrate
Open your account in [jsreportonline](https://jsreportonline.net/) and notice the list of affected templates in the modal. Then clone the affected templates and either change the recipe to the [chrome-pdf](https://jsreport.net/learn/chrome-pdf) or select from the `phantom pdf/phantomjs version` respectively `wkhtmltopdf/wkhtmltopdf version` combo the version without `-windows` postfix. Then follow the migration hints below and test if the template works properly. If everything is fine, change the original template and remove the cloned template.

While keeping the same recipe and just switching to Linux version is easier for the migration, we strongly recommend investing time and migrating to the [chrome-pdf](https://jsreport.net/learn/chrome-pdf) recipe. This recipe is the best choice for pdf rendering. The [phantomjs](https://github.com/ariya/phantomjs) project is suspended and also [wkhtmltopdf](https://github.com/wkhtmltopdf/wkhtmltopdf) isn't actively developed and we may stop supporting them in the future completely (although it isn't currently planned).

## Migration hints
The sizing of the elements when switching the recipe or platform changes. Therefore you need to manually review the templates and adapt the changes for your exact needs. The following hints should get you close to the original windows based outputs.

### Migrate to chrome-pdf (recommended)

- add chrome margin to 1cm to all sides
- change the page format to A4
- set chrome media type to screen
- add the following style

```html
<style>
 body { zoom: 0.8; }
</style>
```

Additionally, chrome doesn't properly handle the `border-spacing: collapse` style. Please see the workaround in the [troubleshooting section](https://jsreport.net/learn/chrome-pdf#troubleshooting).

### Migrate to linux phantom-pdf
add the following style:
```html
<style>
body { zoom: 0.75 };
</style>
```
The Linux phantomjs has problems with OpenSSL and may not be able to load external styles or scripts from CDN linked through `https`. In this case, you need to change the URL referencing them to use plain `http`.

### Migrate to linux wkhtmltopdf
add the following style:
```html
<style>
body { zoom: 0.8 };
</style>
```

## Template content in API call

The templates that aren't persisted but sent through the API uses windows based rendering in case you explicitly set the windows version or your jsreportonline account was created before 18th September 2016.

You can find out if your API calls use the phantom-pdf windows version if you open jsreportonline studio at the startup page. Then open the logs from the "Last requests" section. Then you determine if the template runs on windows when the logs contain the line `Delegating recipe phantom-pdf to windows worker`.

It's recommended to migrate to the [chrome-pdf](https://jsreport.net/learn/chrome-pdf) recipe, however, if you want to just switch to the Linux phantomjs and test the results, you can explicitly set the phantomjs version like this:
```js
{
  "template": {
  "content": "hello world",
    "engine": "handlebars",
    "recipe": "phantom-pdf",
    "phantom": {
      "phantomjsVersion": "1.9.1"
    }
  }
}
```

## What if you don't take any action
We will automatically switch your templates using windows based phantomjs (wkhtmltopdf) to Linux and automatically add the zoom style to at least reduce the visual changes in the pdf.

## Conclusion
We appologize for this inconvenience. We stalled this for many years, but now we need to move forward. On the bright side, you may soon look forward to the big jsreportonline update adding support for the jsreport v3 features. Including the support for using custom npm modules!

Please don't hesitate to reach us at support@jsreport.net
We will do our best to help you with the transition.






