{{{
    "title"    : "Scheduling",  
    "date"     : "12-13-2014 16:32"
}}}

I planned the next release for January but creating jsreport extension is so simple that creating a new one took me just couple of days. With the new `Scheduling` extension you can plan a CRON job which will repeatedly run and render a report. This makes a great combination together with `Scripts` and `Reports` extension if you use a custom script to download data and send output result by email or upload it to the external web service.

`Scheduling` extension was the last peace for jsreport to become a fully capable reporting server. Now you can benefit from jsreport even when you don't use it's API. Just schedule a daily job and send reports using script. No need for anything else, just grab data from somewhere and visualize them. This opens thousands of scenarios where can be jsreport used. 

`Scheduling` extension was designed with scalability in mind. You can spin up multiple jsreport servers connected to mongodb and it will run particular report rendering just once. It will also recover jobs when you restart the server.

The documentation is at the standard place.
[https://jsreport.net/learn/scheduling](https://jsreport.net/learn/scheduling)

![scheduling](https://jsreport.net/img/blog/scheduling.png)

After 18 months of development jsreport has everything I planned to. Need to say it took way longer I planned to but the result is very satisfying. I will now concentrate on stabilizing API, writing documentation, examples and improving the code base. Don't expect big new features for the next months but If you have something in mind don't hesitate to let me know. At the beginning of the next year I will create a road map with future plans for jsreport and any suggestions would be very much appreciated.








