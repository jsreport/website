{{{
    "title": "About jsreportonline service incident",
    "date": "03-02-2017 14:00"
}}}

I would like to take the chance here and describe the outage incident which affected jsreportonline service on 27.2.2017 for roughly two hours.

The whole incident begun at 13:09 CET when we received message from our automatic monitoring service notifying about failed rendering requests. A few minutes afterwards we started to investigate the problems and also received the first complains from users.

The problem originally appeared to be a web servers overload so we disabled the account causing the most of the API calls, but this turned out to be wrong path because the huge amount of requests were caused mainly by a retry logic implemented on the particular user client side. We also created parallel production environment to make sure there're no problems in the infrastructure but it was having the same symptoms.

The servers were still signaling high cpu mainly in the web containers when the rendering containers were running fine. Deeper analysis of web servers revealed that the web containers are constantly crashing because of wrongly implemented mongodb client error handling. This didn't pop up in our logs unfortunately. The quick fix of error handling forwarded us to the real database issues caused by rapid data increase an misconfigured indexes. We fixed the indexes, but the service were still giving very slow responses compared with normal state. 

The analysis of the sudden increase of data amount lead us to the real problem cause. One user misconfigured background schedule and created million of records to what our set up was not prepared. The service got finally to the normal state after we cleaned up this, roughly two hours after the first notification. This was declared in the [jsreportonline status page](https://jsreportonline.a.offsitestatus.com/) and we started to implement permanent service fixes.

Now we've released upgrade to the service which should make sure such problems are not occurring again. The upgrade mainly includes:

1. Introduced limits for amounts of entities stored per account. Details [here](https://jsreport.net/learn/online-limits).
2. Fixed misconfigured indexes.
3. Fixed validations for misconfigured schedules.
4. Fixed mongodb error handling.    

There is now also new page available describing [jsreportonline limits and throttling](https://jsreport.net/learn/online-limits). We make sure this is applied by eliminating noise spreading between service accounts by running each account in the dedicated and isolated docker container with properly configured cgroups.

We apologize for the inconveniences and also commit ourselves to keep the online service the system you can continue to rely on with your production workloads.