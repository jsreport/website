#jsreport and sharepoint integration

jsreport application for sharepoint integrates both platforms together. Where sharepoint provides access to the company data and jsreport acts as a stateless service providing report editor and report rendering processes. Everything nicely fits together so the user does not need to leave the sharepoint page when creating or editing reports. 

jsreport brings to sharepoint it's many reporting capabilities. Let's just mention couple of them like support for many [output formats](http://jsreport.net/learn/recipes) including pdf or excel files. The report definition is based on standard [javascript templating engines](http://jsreport.net/learn/templating-engines) thus there are unlimited possibilities to the report layouts. And the growing open source community 


## Quick start

First find jsreport application in the [office store](https://store.office.com/) and install it to the site collection where you want to store the report templates.

jsreport sharepoint app will add custom list to the site collection during installation. The list called *jsreport Templates* is used for storing report templates as well as rendering reports. Let's wait for application to be installed, refresh the page and navigate to the list.

![report templates](http://jsreport.net/img/sharepoint1.png)

You will find a sample report template prepared for you. Navigate to it's detail.

![list of templates](http://jsreport.net/img/sharepoint2.png)

You should find a *Render report* button on the display form. This button is used for generating report to the new browser tab. You can try to render sample report what should output a pdf.

![rendering report](http://jsreport.net/img/sharepoint3.png)

To edit the report you need to navigate to the edit form first.

![edit item](http://jsreport.net/img/sharepoint4.png)

You can edit basic sharepoint properties like *Title* and *Description* in the common way. However if you want to edit report template itself you need to use *Open editor* button.

![open editor](http://jsreport.net/img/sharepoint5.png)

This should pop up jsreport editor where you can edit the report layout, preview, close it and save it using standard sharepoint buttons afterwards.

![jsreport editor](http://jsreport.net/img/sharepoint6.png)

## Defining templates in jsreport

##Using script to load data
