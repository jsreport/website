{{{
    "title"    : "Every extension has its own repository",
    "date"     : "12-11-2015 9:48"
}}}

Half year ago I [wrote](http://jsreport.net/blog/jsreport-toner-for-nodejs) about the new lightweight node.js based document rendeing package [toner](https://github.com/jsreport/toner). This package was extracted from jsreport and the intention was to make jsreport architecture more layered and also give the node.js community something lighter than full jsreport. After a while we realized we need to go even further. We wanted to give users an opportunity to install just extensions they really want and also emphasis jsreport extensibility. This lead as to complete restructuring of [jsreport](https://github.com/jsreport/jsreport) repository and splitting the code base into multiple packages.

Now you can find in the [github/jsreport](https://github.com/jsreport) organization account the following repositories:

[jsreport-core](https://github.com/jsreport/jsreport-core)    
the minimalist pluggable rendering core

[jsreport-phantom-pdf](https://github.com/jsreport/jsreport-phantom-pdf), [jsreport-handlebars](https://github.com/jsreport/handlebars), [jsreport-scripts](https://github.com/jsreport/scripts), [jsreport-express](https://github.com/jsreport/express) ...    
every extension has its own repository

[jsreport](https://github.com/jsreport/jsreport)         
the full distribution referencing the set of extensions, mostly just wrapper package

![repositories](http://jsreport.net/blog/repositories.gif)


This significant change was introduced in release **0.10**, but as the end user you should not notice it because we tried to be **back compatible** everywhere. This post rather informs the contributors and extension writers how to orient in the new code base.

In the next post I will describe how use [jsreport-core](https://github.com/jsreport/jsreport-core)  separately. It should be very exciting for the node.js developers. Stay tuned.


