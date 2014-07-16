#Pdf rendering perfomance

jsreport is currently not
jsreport will get massive performance improvements in the next release. I will try to 

jsreport dangerous reports with infinete loops


In the current version jsreport every report rendering allocates new nodejs child process to render javascript templating engine and one phantomjs instance to render pdf. This was not very efficient because every sub process startup cost around 20ms. And also caused troubles in big load when thousands of sub processes where allocated at once which caused server to burn.

So what we have done is that we allocate just couple of worker sub procesess for javascript templating engines rendering and couple of phantomjs workers. We reuse this workers over the requests and load balance them so we don't have to wait for workers to start and can spread the work over multiple processes and cpus. It also stays safe for executing dangerous reports because we messure timeouts for the rendering and if the limit is exceeded we kill and recycle affected worker.

Visio image

##Load test

###Tested scenario

- report template from invoice [example on playground](https://playground.jsreport.net/#/playground/l1DbOPsN5)
- input data for 100 invoices, means 100 pages long report, 250kb output pdf size
- 1000 parallel requests

###Hw
- Intel Core i7-2600K 3.4 GHz (4cores), 16GB RAM

###Results
- rendering took 156s 
- memory consumption 2.5 GB
- 641 pdf pages rendered per second
- rendering same report without parallelism takes 0.63s in average 


You can see these results are pretty good. 

Checkout https://github.com/jsreport/jsreport/blob/master/config.md