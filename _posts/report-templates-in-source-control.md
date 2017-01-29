{{{
    "title"    : "Report templates in source control",  
    "date"     : "04-04-2014 12:43"
}}}

Many people wants to install jsreport on their servers and that's why jsreport provides on [premise version](https://jsreport.net/on-prem). The question I was asked many times according to jsreport on premise was: I have just 20 report templates, why I need to have mongo to store them? That is completely valid question and it made me think about implementing a support for a embedded database.

Today I am announcing that jsreport on premise doesn't need mongo db anymore. It uses by default great [nedb](https://github.com/louischatriot/nedb) to store all the data just to the file system. This is greatly simplifying [installation](https://jsreport.net/downloads), maintenance and releases.

Let's see how the file structure with using embedded db looks like.

![national characters](https://jsreport.net/blog/embedded.png)

You can see that every report template is stored in the separate file. This enables great opportunity to easily store report templates into any source control and share them between developers.



