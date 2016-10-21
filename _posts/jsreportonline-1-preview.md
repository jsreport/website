{{{
    "title"    : "jsreportonline 1 preview",	   
    "date"     : "10-19-2016 14:14"	
}}}

I'm very excited to announce that jsreport SaaS known as jsreportonline has integrated the latest jsreport and the release is publicly available for the preview now. You can reach the service on the following url. Note that the environment contains the today's production database copy. **Give it a try and let us know what you think. ** If everything works fine, the production environment should be upgraded in ~2 weeks.

>**https://jsreportonline-test.net**

This new release includes all the goodness from the latest jsreport and also represents major rewrite of the infrastructure running the service. Everything is now ready for reliable and massive scale.

![jsreportonline](http://jsreport.net/blog/jo-1.png)

##Improvements

Here is a short list of the included improvements, but there is a lot more to be looking forward.

- reworked jsreport studio user experience
- jade templating engine
- phantomjs 2.x support
- reworked xlsx recipe with charts or pivot tables support
- attaching multiple scripts to a single template
- console.log support and debug extension
- phantom pdf printing triggers
- dashboard with more information like the logs from the last failed requests
- child template parameters
- templating engine cache
- ...

##Credits calculation
The service now calculates the usage based on milliseconds spent in the rendering container rather than previous calculation based on the number of pdf pages. The old single credit now represents 1000ms. This should distribute the load in more fair fashion. 

## <a name="migration"></a>Migration for existing users
We worked hard to make sure the new release of jsreportonline is back compatible as mach as possible and we don't expect critical problems. 

**However we strongly recommend to try run existing reports against [https://jsreportonline-test.net](https://jsreportonline-test.net) to make sure there are no surprises during the upgrade.** All existing users can easily login to the test server with the same credentials. 

We have made significant infrastructure change and moved our servers from windows to linux. Unfortunately the phantomjs creates different sized outputs on linux. To make sure the existing accounts are not affected we still run the rendering on windows for existing templates and old accounts. The platform used in rendering can be later modified in the studio in template -> phantom -> phantomjs version menu. We also recommend you to design new templates on linux or even modify the existing templates to run on linux. You get better performance and better container based reliability.

`wrapped-html` recipe is now replaced with [html-with-browser-client](http://jsreport.net/learn/html-with-browser-client) recipe. The new recipe has the same API as the old one, you just make sure you are sending correct recipe name in the anonymous API rendering requests.

If you are using firewall rules to whitelist jsreportonline access to your server please don't forget to add the new ip. 




