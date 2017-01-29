{{{
    "title"    : "jsreport studio preview",	
    "date"     : "04-28-2016 19:54"	
}}}

Today we ship to public the very first preview of the new jsreport studio. The new studio will be part of the up coming release of jsreport@1 which is getting very close.

> **Try to play with the new studio http://vnext.jsreport.net**

![preview](https://jsreport.net/blog/preview.png)

You can see from the screen that we have completely reworked the user experience. The studio looks now more like WebStorm, Visual Studio or another modern software development tool. We hope this will dramatically improve the productivity of report designers.

We would now appreciate your feedback. Do you hate it? Does it make you cry? Please let us know. This is not the final version, but we are almost there so this is great time to ask you for comments.

Some notes about the decision behind and technical details.

The current jsreport studio was built allmoust 3 years ago. The web technologies has moved forward since then and we want to keep jsreport up to date. So we decided to do the complete rewrite using modern webstack which includes [react](https://facebook.github.io/react/), [webpack](https://webpack.github.io/) and [redux](https://github.com/reactjs/redux). Theese great technologies let us to achieve this kind of complex layout and features. I'm personally very happy for this decision, because it was pleasure to work on it.

As usually you can find the sources on the github - https://github.com/jsreport/jsreport-studio
However there is huge work ahead in code base with finalizing extensible API and documentation for it. I forgot to mention. As is common in jsreport, everything is extensible, so again all the images, scripts, schedules, reports, users.... are separated plugins. And it'll be easy for other developers to write their own extensions.
 
 Again the link to the live preview. Don't worry with destroying it. Create your own templates, scripts, edit existing....
 > **Try to play with the new studio http://vnext.jsreport.net**