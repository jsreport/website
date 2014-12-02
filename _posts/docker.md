{{{
    "title"    : "Docker",
    "date"     : "11-07-2014 22:00"
}}}

jsreport has now official <a href="http://docker.io">Docker</a> image. You can find it [here](https://registry.hub.docker.com/u/jsreport/jsreport/). If you are not familiar with Docker I encourage you to check it out. It is great platform for delivering and installing distributed applications.

Docker makes running jsreport so simple that you can basically just type

`sudo docker run -p 443:2945 jsreport/jsreport`

and you have jsreport server magically running in a minute. Whole server will run inside a container you can easily stop or delete anytime without affecting the rest of your system. This makes prototyping with jsreport super easy. Doesn't it?

You can find more details about jsreport image in [official docker hub repository](https://registry.hub.docker.com/u/jsreport/jsreport/). As everything else docker package is also open sourced in [github](https://github.com/jsreport/docker).