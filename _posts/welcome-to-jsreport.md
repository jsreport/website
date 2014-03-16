{{{
    "title"    : "Welcome to jsreport!",  
    "date"     : "03-14-2014 20:56"
}}}



###Welcome to **jsreport**!###
Mark this date to the encyclopedia as the first public preview release of the revolutionary reporting platform. It took 9 months 
including all the weekends to finalize works and we are very proud to announce that it's done.

###Why we need a new way of doing business reports and how I got the idea...###

I was having a big pain in my brain every time I was forced to do some pdf business reports generation for our customers. It was very nasty work in WYSIWYG designers like one from Crystal Reports or one from Telerik. These designers were structuring the reports all the time in different way that I wanted them to. It was also crushing visual studio on the regular basis. When it came to merging my report definitions with other developers, I was forced to manually merge quite big and dirty xml. So we rather dedicated one poor developer guy to do only reports. When we wanted to provide a way to customer to modify report templates, we needed to buy them a developer license of these tools and then import some xml definitions back to our system. Quite complicated. There are many other pitfalls but I will stop here. 

I think that everything that is just wrong in current reporting software is the concept of some super fancy WYSIWYG editors that are creating some custom xml. This is the way developers will never like. Just think how often you use html WYSIWYG editors to write html page, or JSP page, or asp.net page. Developers don't like to click into some black hole. They like to code and have full control. The problem was that I was missing a platform that would allow me to code report and let me stay productive. I was trying to 
use xml/xslt/fop to generate pdf report, but I realized that it's not productive. I stopped and start to think. 

What is the best approach to define report output using the source code? 

  - It must be secure and scriptable so I can let my customers to modify reports. 
  - It must be able to provide dynamic report layout as well as some dynamic values computations. 
  - It must be super easy to write and read. 

After looking for a while at my college I realized that we already have **JavaScript** and **templating engines** like mustache for all of this. I can actually just compile and render templates in some JavaScript interpret like **nodejs** and print the result. Only missing thing is that JavaScript templating engines are designed to render html and I would like to have pdf. That's easy, just use some webkit wrapper like **phantomjs** and print the html to pdf.

###Summary###
I don't like the way of designing business reports in WYSIWYG editors. jsreport allows you to write the reports using code. Just use JavaScript templating 
engines and jsreport will render your template in nodejs sandbox and print it to pdf output.

Other blog posts about jsreport features will come soon, so stay connected.

If you want to try fiddling with jsreport, go ahead and try [free playground](https://playground.jsreport.net)

If you like to try enterprise jsreportonline, go ahead and [sign up](https://jsreportonline.net) 

If you are lost, tweet me to @jan_blaha or see the [documentation](http://jsreport.net/learn)
