{{{
    "title"    : "Pdf reporting performance",
    "slug"     : "pdf-reporting-performance",  
    "date"     : "07-16-2014 15:08"    
}}}



It's quite a while since I wrote the last blog post about jsreport and you maybe wondering what is new and what we are currently working on. It's 2 months since we closed feature scope and started to concentrate mainly on better code base, stability and performance. We have made a huge step already in all of these areas. Today I will go deeper into performance improvements we have added into jsreport and show you some results.

Some background...

jsreport is safe by design and rendering any report should not hurt the system. This was reached by moving report rendering into separate process where we control it's consumptions and kill it if needed. Unfortunately this turned out to be quite slow approach and not very well behaving when thousands of requests to render report come at once. The biggest problem there is allocating child process for every request takes some time and also you cannot allocate hundreds of them at once.

To solve this problem we slightly changed jsreport infrastructure. Right now we are allocating just fixed amount of child processes and reuse them over multiple requests. We have separate workers for javascript templating engine rendering as well as for printing pdf files using phantomjs. This change has huge impact on jsreport performance and on scalability as well. Now jsreport can server thousands of request at once and doesn't need to even sweat. It also stays safe for executing dangerous reports because we measure timeouts for the rendering and if the limit is exceeded we kill and recycle affected worker.

You can see current jsreport infrastructure schema on the following picture.
![schema](https://jsreport.net/blog/performance/schema.png)

By default jsreport allocates a worker for every cpu to maximize parallelization. This can be changed in config file and I recommend you to check out [config file documentation](https://github.com/jsreport/jsreport/blob/master/config.md) for other options.

Ok, give us some numbers and results...


###Tested scenario

- report template from invoice [example on playground](https://playground.jsreport.net/#/playground/l1DbOPsN5)
- input data for 100 invoices, means 100 pages long report, 250kb output pdf size
- 1000 parallel requests

###Hw
- Intel Core i7-2600K 3.4 GHz (4cores), 16GB RAM

###Results
- rendering took 156s 
- memory consumption 1.5 GB
- 641 pdf pages rendered per second
- rendering same report without parallelism takes 0.63s in average 

###Conclusion
You can see these results are pretty good. This means that doing reports based on html -> pdf conversion is not only the most flexible way but also performing very well. 641 pdf pages per second should be enough for the most crazy reporting solution you have.