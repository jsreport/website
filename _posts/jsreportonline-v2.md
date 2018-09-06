
{{{
    "title"    : "jsreportonline v2",
    "date": "09-06-2018 19:30"
}}}





**I'm very excited to announce jsreportonline v2 is here.**

The jsreportonline users can now benefit from the improvements we built into the jsreport during the past year because jsreportonline now runs the latest jsreport v2. Among many others these features just arrived to jsreportonline:

1. New [chrome-pdf](/learn/chrome-pdf) recipe based on google chrome which supports latest web technologies and is the current mainstream and default recipe for jsreport 
2. [Freeze extension](https://github.com/jsreport/jsreport-freeze) - use studio UI to block accidental updates to your production templates 
3. [Pdf utils extension](/learn/pdf-utils) - join multiple pdfs, merge dynamic headers or watermark
4. [Version control](/learn/version-control) - version changes in templates and use commands like "commit" or "checkout" right from the studio (will be two weeks delayed)
5. [Scripts extension](/learn/scripts) now supports promises and async/await syntax  

We made sure that all the breaking changes and deprecated features are automatically migrated. This means you don't find [images](/learn/images) in your accounts because they have been automatically converted into [assets](/learn/assets) for example. Please check jsreport latest [documentation](/learn) to see the new stuff in more detail.

However we have one deprecation announcement that affects jsreportonline. We now officially deprecate the phanton-pdf and wkhtmltopdf recipes running on WINDOWS platform. The support for optionally running on windows was introduced two years ago for back compatibility reasons and it was also recommended to move to the standard recipes running on linux. These are better isolated and secure. We will keep it running for one more year until 1.10.2019, but then we switch everything to linux. It should give you plenty of time to migrate to the linux phantomjs/wkhtmltopdf or even better to the chrome.  
