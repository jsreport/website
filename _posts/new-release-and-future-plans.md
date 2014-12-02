{{{
    "title"    : "New release and future plans",
    "date"     : "12-02-2014 10:50"
}}}


I have just released new version (0.2) of jsreport with significant improvements. I will quickly summarize what is new and also what you can be looking forward in the next releases.

##Excel recipes
Probably the biggest feature in v0.2 is support for excel reports. Or to be more precise for xlsx reports because you could always generate html in jsreport and open it in excel. v0.2 comes with two xlsx recipes where one is quite limited but super simple to use and another one is quite complicated to use but very powerful.

The first one is called `html-to-xslx` and it just simply converts html into xlsx as name implies. You just put the html table into the template content, run it and get excel online preview. This is very simple to use but only couple of css properties are supported. Read mor about limitations [here](/learn/html-to-xlsx).

> Check out html to xlsx online in [**playground**](https://playground.jsreport.net/#/playground/Y3BG0fnPa).

The second recipe called `xlsx` is generating xlsx file directly from open spreadsheet xmls. This can be quite complicated to use but you get full power on the other hand. You can find more in the [learn section](/learn/xlsx).

> Check out xlsx recipe in action in  [**playground**](https://playground.jsreport.net/#/playground/YBjmBsPFa)

##Text recipe

The third new recipe in v0.2 is called `text` and it simply generates text based files like `xml` or `csv`. There is nothing complicated about this, see the [documentation](/learn/text).

> Check out how to generate csv in [**playground**](https://playground.jsreport.net/#/playground/Y3QQDfP9a)

##Integrating jsreport
This version also includes many improvements in the [`embedding`](/learn/embedding) feature which should allow you to better integrate jsreport ui into your web applications. You can check it out when you add `studio=embed` query parameter after url to the jsreport server. So for example https://localhost/?studio=embed . This feature is getting more mature with every release and you should soon see it running inside other systems like sharepoint.

##Bug fixes
As always I am trying to fix every bug you submit into github or google groups with the highest priority. This release fixes following bugs and some others as well.

[Getting javascript error in render report](https://github.com/jsreport/jsreport/issues/27), [rootDirectory](https://github.com/jsreport/jsreport/issues/26),
[Make limit for incoming request size configurable](https://github.com/jsreport/jsreport/issues/17), [Purge temporary files ](https://github.com/jsreport/jsreport/issues/22)

##Future plans

The next bigger relase should come maximum in the next two months including mainly java sdk and reports scheduling. This should close the planned features scope and I will concentrate more on jsreport propagation, support and documentation for a while.



