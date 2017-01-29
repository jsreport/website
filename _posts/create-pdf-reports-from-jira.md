{{{
    "title"    : "Creating pdf reports from jira",
    "slug"     : "creating-pdf-reports-from-jira",  
    "date"     : "08-24-2014 20:09"    
}}}

jsreport is able to generate pdf reports from any external system having an API without any changes or implementations needed on the external system side. You just basically need to create a custom jsreport script that will actively download data from external system and create html defining report layout using common javascript templating engines. You can directly check [following example](https://playground.jsreport.net/#/playground/lyWJuycgAc) if you are not familiar with this principle.

Downloading report data using custom jsreport script can be quite easy but can also become a little difficult when reaching system like jira or sharepoint with complex API. Fortunately these systems have usually some wrappers around api to make integration simple.  For example [node-jira](https://github.com/steves/node-jira) is one of these wrappers for [jira bug tracking system](https://www.atlassian.com/software/jira).

Using jsreport to render pdf reports from jira is quite common use case there for I decided to write a jsreport extension that will allow to use [node-jira](https://github.com/steves/node-jira) directly in the jsreport custom script. You can find this extension on github in [jsreport-contrib-jira](https://github.com/jsreport/jsreport-contrib-jira) repository. It's pre-installed in jsreport [online](https://jsreport.net/online) but you need to explicitly install this extension to jsreport [on-prem](https://jsreport.net/on-prem) by:

> npm install jsreport-contrib-jira

##Example
Once is `jsreport-contrib-jira` extension running you can use `require('jira')` inside your custom scripts.

Simple example of getting jira issues for particular user.

```javascript
JiraApi = require('jira').JiraApi;
var jira = new JiraApi('https', 'simplias-jira.atlassian.net', 443, [username], [password], '2');

jira.getUsersIssues([username], true, function(err, res) {
    request.data = res;
    done();    
});
```

And then for example display issues using `jsrender`
```html
{{for issues}}
    <h3>
        <img src='{{:#data.fields.status.iconUrl}}' /> 
        {{:#data.key}} - 
        {{:#data.fields.summary}}
    </h3>
    <p>
        {{>#data.fields.description}}
    </p>
{{/for}}
```

And how it looks in the jsreport studio....



<a href="https://jsreport.net/img/blog/jira.png" target="_blank">
<img src="https://jsreport.net/img/blog/jira.png" alt="jira pdf report" style="width: 800px;"/>
</a>

>


