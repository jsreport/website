
{{{
    "title"    : "Release 2.7.0",
    "date": "03-04-2020 19:30"
}}}


**jsreport 2.7.0 is here**  

It took us quite a while this time, but today we are finally shipping jsreport 2.7.0 with very significant improvements. You can find the full details and release notes in the [github releases](https://github.com/jsreport/jsreport/releases/tag/2.7.0) as always. Here I share just the main highlights.  

## General timeout  

Since the very beginning, jsreport supports setting different timeouts for templating engines, scripts or chrome but it is missing a configuration to set just one timeout for the whole report rendering. The 2.7.0 release finally brings the `reportTimeout` to cover this missing piece.  

The `reportTimeout` should be the only option for the future and the granular timeouts are now deprecated. One timeout to rule them all.  

## Docx improvements  

The `docx` internal implementation was dramatically optimized to support bigger documents and bring better performance. Additionally, the new version brings new helpers like  

- docxPageBreak    
- docxCombobox    
- docxCheckbox    
- docxImage with url support in src attribute   

## Html to xlsx  

The `html-to-xlsx` recipe was also optimized. For this reason, helper `htmlToXlsxEachRows` was introduced which helps us to process big documents using streams without having everything in memory.  

To speed up the rendering time new `cheerio-page-eval` html engine was introduced which doesn't require slow DOM loading.  

## Pdf utils  

Pdf utils merge operations now produce dramaticaly smaller output pdfs. This is beause the extension filters out big duplicated streams like fonts.  

## Transactions  

Not so much visible, but the import/export extension now uses transactions with consistent and atomic writes. So it won't happen that import breaks your current data. If it fails everything is rollbacked. This works accross all stores including fs.