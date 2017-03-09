{{{
    "title": "One file, one executable, whole jsreport",
    "date": "03-09-2017 14:26"
}}}

I'm very excited to announce that we've just released something I've been dreaming about for the last two years. 

**We've successfully compiled the whole jsreport including node.js and phantom.js into single executable file.** 

This now part of the jsreport 1.5 release and you can find the link to it on the [download page](../on-prem). This opens new possibilities 
and mainly simplifies many integration use cases. You don't need npm or even node.js installed, 
you just add one file to your application and start generating pdf or excel reports.

##Powerful utility
The executable can be for example used as powerful stateless pdf rendering utility.

<br/>
![executable](executable.gif)

##Full server
Or you can configure and run it as full jsreport server with studio. You just need to run two commands 

<br/>
![configure executable](configure-executable.gif)

When you are done with designing templates, you can keep the server running and call its [REST API](../learn/api) or [CLI](../learn/cli). Or you can shut it down and use `render` command to print defined templates.

```
jsreport render 
	--template.name=MyTemplate 
	--data=mydata.json 
	--out=myreport.xlsx
```

