{{{
    "title"    : "Sending reports periodically in email",  
    "date"     : "01-03-2015 16:32"
}}}

With the new [scheduling](/learn/scheduling) extension and improvements in [scripts](/learn/scripts) extension you can easily define periodically running job which will generate a report and send it through email.


##Create report template
The first thing you need to do is create a report template which will be attached to the email. The output from report template can be filled as email body if its output is html or it can be attached to the email if its other format like pdf.

##Create script

###Fetch data from API
There is no big meaning in emailing reports with static data so you will probably need to fetch some. The most common way to get data in this situation is to use jsreport [custom script](/learn/scripts). The custom script can fetch data from your or any other API using [request](https://github.com/request/request) module. The logic requesting data should be invoked in custom script global function called  `beforeRender`  and can look as following example:

```js
function beforeRender(done) {
  require('request')({ url: 'http://domain/api/foo', json:true })(err, body, response) {
    request.template.data = body;
    done();
  }
}
```

You should create your custom script in jsreport studio and implement similar `beforeRender` function.

###Send email
The second thing custom script can do is send email with output report. To do it you need to create `afterRender` global function which will be invoked when the output report is ready to be responded. To actually send email you can use for example [SendGrid](https://github.com/sendgrid/sendgrid-nodejs) module:

```js
function afterRender(done) {
  var SendGrid = require('sendgrid');
  var sendgrid = new SendGrid('username', 'password');

  sendgrid.send({ to: '',  from: '', subject: '',
          html: 'This is your report',
          files: [ {filename: 'Report.pdf', content: new Buffer(response.content) }]
  }, function(success, message) {          
          done(success);
  });
}
```

##Test email sending
It's time to go back to the report template and associate created script.  Now every time you hit `Run` button it should preview the report and send the email as well. You should stick here until you are satisfied with the report and email content as well.

##Create schedule
The last missing piece is to create a periodically running job rendering previously created report template and sending it through email. This can be easily achieved using [scheduling](/learn/scheduling) extension. With this extension enabled you should see `Create Schedule` action in the jsreport studio. The `Schedule` specifies periodical job rendering a report template and requires following attributes to be filled.

1. **Name**
2. **Cron    **
This field should contain Cron expression identifying period in which the job should run. For example `*/10 * * * * *` expression specifies 10 seconds interval. 
3. **Template**
This should be the report template you previously created

Now with the enabled `Schedule` you should be receiving emails with the specified period.

##Conclusion
jsreport doesn't need to be only passive pdf generator. You can use it as a full reporting server actively downloading data from your API, rendering reports and uploading them to a web service or sending through email. Your system doesn't even need to know jsreport server somewhere exists and whole reporting architecture can be nicely loosely coupled.






