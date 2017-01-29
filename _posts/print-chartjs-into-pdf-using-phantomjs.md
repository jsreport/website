{{{
    "title"    : "Print Chart.js into pdf using phantomjs",	   
    "date"     : "11-27-2016 15:13"	
}}}

> **Live example is [here](https://playground.jsreport.net/studio/workspace/SkcQLLOGl/3)**

Printing outputs of [Chart.js](http://www.chartjs.org/) using [phantom-pdf](/learn/phantom-pdf) recipe doesn't work by default and it usually produces an empty content in pdf. This is caused by charts' animations and it is required to instruct recipe to start printing content after everything is fully loaded. Fortunately this is very easy.

The first you need to instruct recipe to wait for your signal before starting printing. This is done in `phantom-pdf` menu under `wait for printing trigger` menu.

![phantom pdf trigger](https://jsreport.net/blog/phantom-pdf-trigger.png)

The second and also the last thing to do is catch chart event `onComplete` and trigger the printing
```js
var myChart = new Chart(ctx, {
      ...     
      options: {
            animation: {
                onComplete: function () {                
                    window.JSREPORT_READY_TO_START = true
                }
            }
        }
    });
```

Note you can do the same also with [electron-pdf](https://github.com/bjrmatos/jsreport-electron-pdf) recipe. 

<iframe src='https://playground.jsreport.net/studio/workspace/SkcQLLOGl/3?embed=1' width="100%" height="400" frameborder="0"></iframe>