{{{
    "title"    : "Securing reporting server",
    "date"     : "11-05-2014 15:20"
}}}

The time you were hiding jsreport behind firewall is gone. With the new jsreport release comes support for securing access to the reporting server.

##Authentication

You can secure jsreport server by enabling and configuring [authentication](/learn/authentication) extension. This will add shiny login page and secure API with [basic](http://en.wikipedia.org/wiki/Basic_access_authentication) authentication.  You can find how to configure authentication extension [here](/learn/authentication).


##Authorization

You can secure individual user access to jsreport by configuring [authorization](/learn/authorization) extension. You need to first provide an endpoint to your service responsible for authorization. jsreport will then ask your service first before performing an operation and you can decide what is the user authorized to do. Find more about authorization [here](/learn/authorization).
