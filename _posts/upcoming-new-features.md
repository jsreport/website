{{{
    "title"    : "Upcoming new features",  
    "date"     : "10-09-2017 21:06"
}}}
jsreport got finally stable enough that we can primary focus on the further development of the new features. I believe this is great news for everybody using jsreport today. We don't receive many bugs and our hands are finally free to look into the future. I would like to quickly share with you what you can be looking forward and what we are currently working on.

## Drag and drop designer
This is probably one of the most requested feature from the very begging of the jsreport project. Give us a report designer, that not only developers can use, but also normal end users. We were postponing it for quite a while because it is very complex to implement. However we have enough capacities for it now so we already started couple of months ago and you should see a preview at the very begging of the next year.

How it will work? The scope should be pretty much similar to other designers you could be already familiar with. You integrate the designer into your web or desktop application and it will let your users to drag components from the palette. Bind data to the components and preview the output report. 

The first strong side of the jsreport designer will be its extensibility. We expect that a developer integrating jsreport designer will be able to do the following:

- add calculations commonly used in the target domains
- implement and register advanced components which are useful for the particular report
- define structure of the input data 

The idea is to make the life of the end user easy as possible. He should get designer tailored exactly for his needs.

The second strong side should be relying on the html, js and css. The user will be able to fallback and edit each component's output using simple html and js so the designer won't trap him. There will be really no limitation for the end user. 

## More powerful templates store
The templates store will get many requested features. You can look forward to entities hierarchy so you can better group reports together. The default file system store should be able to parse all random files as assets and resolve them using relative paths. 

And finally, we are preparing templates store extensions that will allow to store templates in AWS s3 or Azure Blob Storage. This will work also in clustered environment and synchronize using pub/sub service bus. 

## Chrome
We've recently released [chrome-pdf](/learn/chrome-pdf) recipe which uses chromium to render pdf and it looks like very promising replace for the older  [phantom-pdf](/learn/phantom-pdf) recipe. Unfortunately it doesn't support custom page header/footer yet so we keep it as a custom extension. However as soon as the header feature arrives, we will work on making this recipe the default one.

## Simplified configs
We want to also simplify the jsreport for the beginners so we will change some default config values and group other together. In the end the default jsreport should be easier to start with for the majority of the users.

## Conclusion
We are now heavily working on making jsreport even better platform for generating reports and there is a lot to be looking forward. Please stay tuned or let us know what features would you like us to look into.
