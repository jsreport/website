{{{
    "title"    : "Reporting service infrastructure and performance",
    "date"     : "09-26-2014 15:30"
}}}

I have recently blogged about jsreport performance when it comes to phantomjs pdf to html conversion. It turned out jsreport is heavily optimized for massive reporting and able to produce hundreds of pdf pages per second on just one server (whole article can be found [here](http://jsreport.net/blog/pdf-reporting-performance)). This sounds good but we need even more for [jsreport online](http://jsreport.net/online) providing pdf reports as a service. People are coming and asking if jsreport online service can handle their million reports and I say YES. In fact jsreport online service is already generating million reports.  I will share some details about its infrastructure in this blog post for those who are interested.

This is the jsreport online infrastructure schema I will talk about:
<a href="http://jsreport.net/blog/online-schema.png" target="_blank">
<img src="http://jsreport.net/blog/online-schema.png" alt="schema" style="width: 600px;"/>
</a>

The first thing it need to handle is reliability of the data storage. The service is using nosql [mongodb](http://www.mongodb.org/) as a data storage. To avoid interruption  of the service in case of hw error it uses 3 nodes. Two nodes represents primary and secondary database. The third node is an arbiter participating in [primary node election](http://docs.mongodb.org/manual/core/replica-set-elections/). All nodes are grouped into so called replica set. The service then can fail-over to second running node when the first is broken.  This guarantees maximum reliability of the data storage. jsreport is rather computation heavy then data store heavy solution so we don't need any additional scaling in data storage currently.

Next it need to provide fluent user interface not affected by underlying peak in report  generation from API calls. The service has two types of servers processing incoming requests because of this. The first type of the server just handles user requests from the web browser and the second type is responsible for processing requests from API calls. This assures to users nice experience and quick responses for previewing reports during development.

Both types of servers are sitting behind a loadbalancer distributing requests between multiple servers. Number of servers powering jsreport online service is extendable automatically or just by one click. It can grow separately for both types of servers where we typically need scale workers serving API calls.

All servers are currently running in the [Microsoft Azure](https://azure.microsoft.com) cloud. Mongo servers are running on CentOS linux distribution inside virtual machines. jsreport servers are then running [node.js](http://nodejs.org) in azure cloud service on Windows Server 2012 (this may be changed in the near future). All servers are currently running in the west Europe region but this is only matter of time when it will be extended into other regions to get closer to bigger customers.

So if you need to generate monthly million pdf reports. Don't be afraid. jsreport online can handle it.