
{{{
    "title": "HTML embedded in docx",
    "date": "03-05-2023 21:40"
}}}

We've been investing in the [docx](/learn/docx) rendering massively during the last year. This was because we wanted to satisfy user requests which were mostly focusing on the office rendering in jsreport recently. One of the latest improvements, which I would like to announce, is **🚀 embedding HTML into the docx**.

This feature is popular in use-case when the end user fills some rich text using a WYSIWYG editor and you would like to embed it into your [docx](/learn/docx) report. Imagine you let end users fill in comments that you would like to collect and automatically print them into a docx summary.

💻 To implement this, you simply create Word template, with a `each` loop using [docxHtml](https://jsreport.net/learn/docx#docxhtml) helper.  Additionally, you can use all the [docx recipe](/learn/docx) features and insert end-user images or other data. The complete report can look like the following. On the left side is the Word template and on the right is the docx output.

![html-embedded-docx](/img/blog/html-embedded-docx.png)    
<br/>    
**🧪 As always, you can enjoy the full demo right now in the [playground](https://playground.jsreport.net/w/admin/sPIbOLmU) and fiddle with it.**

The [docxHtml](https://jsreport.net/learn/docx#docxhtml) helper supports a rich set of HTML tags. Currently, the list looks like this:
`<p>,<div>,<span>,<b>,<strong>,<i>,<em>,<u>,<ins>,<small>,<sup>,<s>,<del>,<code>,<pre>,<h1..6>,<ul>,<ol>,<li>,<br>,<a>,<img>,<table>`

Do you need additional `docxHtml` support? 🙏 Let us know.