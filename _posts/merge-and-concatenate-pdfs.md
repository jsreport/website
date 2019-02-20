{{{
    "title"    : "Merge and concatenate pdfs",	   
    "date"     : "01-09-2018 21:50"
}}}

I'm super excited to announce we've just published the new jsreport extension called [pdf-utils](/learn/pdf-utils) which improves jsreport pdf generation capabilities by magnitude.

Its one line description may look boring at the first glance:

> Merge or concatenate multiple pdf templates into one output pdf

However with further look it pops up this extension solves the most pdf generation limitations phantomjs, wkhtmltopdf or chrome has. Lets see this on the examples.

## Chrome pdf headers
Everybody would like to use the latest css and javascript features and render pdfs using [headless chrome ](/learn/chrome-pdf). However chrome doesn't support custom headers. It is [getting close](https://github.com/GoogleChrome/puppeteer/issues/373) but this feature will be for very long time very limited.

The [pdf-utils](/learn/pdf-utils) comes with help. It lets you to make separate header template, render it into separate pdf and then merge it anywhere back to the main one. Even rotated on a side.

**[See the demo in playground](https://playground.jsreport.net/w/anon/88frMRyl)**

## Mixed pages orientation

The common tools for rendering pdfs from html have very limited options to change page sizes or orientation dynamically. The [pdf-utils](/learn/pdf-utils) is here again to solve this problem, because it allows to create multiple pdfs separately and concatenate them into one.

**[See the demo in playground](https://playground.jsreport.net/studio/workspace/BkujXYfVG/10)**


## Really dynamic headers

The pdf headers often needs to be aware of the full context and content of the particular page. The page number is not enough. Lets say a report needs header with summary of items visible on the current page. Again, this is not possible with common tools, but [pdf-utils](/learn/pdf-utils) has the solution. It is able to embed information to each page and forward it to the fully dynamic header rendering.


**[See the demo in playground](https://playground.jsreport.net/studio/workspace/BkEHf9MNG/11)**

## Conclusion

This extension is one of the biggest pdf rendering improvements we have done in jsreport. Please install it, play with it and give us feedback.
You can also find other examples and complete documentation [here](/learn/pdf-utils).
