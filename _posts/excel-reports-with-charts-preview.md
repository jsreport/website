{{{
    "title"    : "Excel reports with charts preview",	
    "date"     : "06-02-2016 15:09"
}}}

While waiting for [phantomjs to stabilize the second version](https://github.com/ariya/phantomjs/milestones/Release%202.2) we are adding more and more features to delayed release of [jsreport v1](https://github.com/jsreport/jsreport/issues/178). Today I'm gonna show you the preview of improvements we have done in the excel generation.

![excel-chart](https://jsreport.net/blog/excel-chart.png)

##Open xml and templates

We [came to conclusion](https://github.com/jsreport/jsreport/issues/181) that the best workflow for creating nicely styled excels is the following:

1. Open Excel and prepare template with styles, alignments and chart definitions
2. Upload the excel template into jsreport
3. Use templating engines to edit the Excel Open XML 

> **See this live in [playground](https://playground.jsreport.net/studio/workspace/rJftqRaQ/10)**



##Predefined helpers
While there are no issues with creating excel templates or uploading them into jsreport, the editing of Open XML with templating engine like handlebars can be difficult. To make your life easier jsreport adds several helper functions which you can use to replace or add particular piece of Excel Open XML ( you can observe the excel XML structure if you unzip any xlsx file).

With jsreport helpers, adding a row to sheet can look like this:

```html
{{#xlsxAdd "xl/worksheets/sheet1.xml" "worksheet.sheetData[0].row"}}
    <row>
        <c t="inlineStr"><is><t>Hello world</t></is></c>
    </row>
{{/xlsxAdd}}
```
Here I'm using block helper `xlsxAdd` which accepts the path to particular excel file as the first argument, the path inside the xml as the second argument and the xml to be added in the helper content.

> **See this live in [playground](https://playground.jsreport.net/studio/workspace/S1hxRk0X/2)**


##Full control

The preferred approach is to create the excel template the first and then just edit it. However you are not forced to do it this way.  If you don't select the template, jsreport adds the empty xlsx template on the input which you can extend. It shouldn't be a problem because you have full control over the excel file source and you can manually add charts or even pivot tables as you like. It'll just require more time to understand the Open XML format.

> **See this live in [playground](https://playground.jsreport.net/studio/workspace/By0saJAm/2)**

##Images

Adding images into the excel requires to alter the xml on several places and can easily become tedious. It's also so common we decided to added dedicated helper to add images.

```html
{{#xlsxAddImage "test" "sheet1.xml" 0 0 1 1}}
base64content...
{{/xlsxAddImage}}
```

> **See this live in [playground](https://playground.jsreport.net/studio/workspace/H1gQapp7/2)**

##How does it work

The following steps are happening under the hood

1. When uploading excel template, jsreport unzip its content, split it by files and convert xml files into one big json
2. Helpers like xlsxAdd or xlsxReplace operates on the JSON from step 1 which is provided on input data as `$xlsxTemplate`
3. At the end of the template there must be called `{{{xlsxPrint}}}` which will serialize the modified `$xlsxTemplate` into the template output
4. Recipe parses one last time the JSON from step 3, converts it into files, zip it and respond with final xlsx file

You see that mostly you can find the xml content inside excel based template, however under the hood helpers mostly work with JSON. We find this more convenient even if it requires several extra xml<->json conversions.

If you are curious you can find the default xlsx helpers' sources [here](https://github.com/jsreport/jsreport-xlsx/blob/master/static/helpers.js)

##Summary
With this improvements excel will finally becomes the first class citizen in jsreport. We're gonna to stabilize this now and release it with jsreport@1 as the default xlsx recipe. Maybe we'll also add some additional helpers like `xlsxAddRow` to make the usage more simple. Or maybe integrate it also with `html-to-xlsx` recipe. Lets see, stay tuned.

As always, we would love a feedback on this!