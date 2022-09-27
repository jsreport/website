
{{{
    "title": "Release 3.8.0",
    "date": "09-26-2022 15:04"
}}}

**🚀 jsreport 3.8.0 includes attractive new features, lets check it out.**

## embedding simple html to docx

The [docx](/learn/docx) recipe now includes new helper `docxHtml` which can be used to transform and embed simple html into docx. This can be used, for example, when you need to insert user inputs from the WYSIWYG editor.

![docx-html](/img/blog/docxHtml.png)

## pdf/A support

You can now opt-in and let jsreport convert the output pdf into pdf/A.

![pdfa](/img/blog/pdf-a.png)

## pdf accessibility
[chrome-pdf](/learn/chrome-pdf) by default produces accessible pdfs, but until now the pdf utils operations weren't able to combine multiple documents and preserve the accessibility tags. Now you can opt-in and preserve the accessibility.
    
![pdf acessibility](/img/blog/pdf-accessibility.png)

## cross pdf links
The new `pdfDest` helper can be used to declare links across different pdf documents combined together using pdf utils operations.

```html
<!-- one template-->
<a  href='#1'  id='1'>
  link to another template
</a>
```

```html
<!-- second template (appended)-->
{{{pdfDest  "1"}}}
<h1>hello</h1>
```