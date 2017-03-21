{{{
    "title"    : "phantomjs pdf watermark",	   
    "date"     : "03-21-2017 13:41"	
}}}

> **[See demo in playground](https://playground.jsreport.net/studio/workspace/B1c8HcCix/8)**

You may find yourself in need putting a watermark like a company logo on each pdf report page. Unfortunately css `fixed` position which would nicely solve this won't work in [phantom-pdf](https://jsreport.net/learn/phantom-pdf) recipe. You need to take a longer road and position the watermark on each page using javascript hack.

The javascript solution basically estimates number of pages based on the document height and appends watermark using absolute positioning to each page. This is quite simple, however phantomjs doesn't correctly calculate positions and we need to hack some numbers a bit. See the comments in bellow snipped: 

```js
/* magical page size number was only estimated based on very long report
 to actually fit the correct page number, I don't have any meaningful calculation for it now */
var pageSize = 1274
var numberOfPages = Math.ceil(document.height / pageSize)
    
for (var i = 0; i < numberOfPages; i++) {
    var watermark = document.createElement('div'); 
            
    var waterMarkTop = 0
    
    // top of the current page
    waterMarkTop += i * pageSize
    
    // fix phantomjs incorect calculation of page margin
    // 31 again magical number
    waterMarkTop += i * 31
            
    // poistion somwhere to the middle of the page
    watermark.style.top = waterMarkTop + 'px';   

    watermark.innerHTML = 'ALL PAYED';   
    watermark.style.position = 'absolute';
            
    document.body.appendChild(watermark);
}
```

Note this should just give you a hint how to achieve correct watermark position. It is not an official solution and it may not work in all cases. This solution will also need to set up different sizes when running on linux phantomjs.

Try it in playground.
<iframe src='https://playground.jsreport.net/studio/workspace/B1c8HcCix/8?embed=1' width="100%" height="400" frameborder="0"></iframe>