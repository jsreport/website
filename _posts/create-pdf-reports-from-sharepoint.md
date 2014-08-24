{{{
    "title"    : "Create pdf reports from sharepoint",
    "slug"     : "create-pdf-reports-from-sharepoint",  
    "date"     : "07-18-2014 13:18"    
}}}

jsreport is able to generate pdf reports from any external system having an API without any changes or implementations needed on the external system side. You just basically need to create a custom jsreport script that will actively download data from external system and create html defining report layout using common javascript templating engines. You can directly check [following example](https://playground.jsreport.net/#/playground/lyWJuycgAc) if you are not familiar with this principle.

You can see downloading report data using custom jsreport script can be quite easy but can also become a little complex when reaching system like sharepoint with complex API. Fortunately these systems have usually some wrappers around api to make integration simple. 

```javascript
var Sharepoint  = require('sharepoint-api')

var sp = new Sharepoint({
    host: "pofider.sharepoint.com",
    username: "pofider@pofider.onmicrosoft.com",
    password: "blaha4888*"
});


request.data = {};

function loadUsers(cb) {
    sp.query({ resource: "Lists", filter: "Title eq 'User Information List'"},function(err, r) {
        sp.query({ resource: "Lists(guid'" + r.data.d.results[0].Id + "')/Items"}, function (err, rr) {
          request.data.users = rr;
          cb();
        });
    });
}

function loadLists(cb) {
    sp.query({ resource: "Lists"},function(err, r) {
        request.data.lists = r;
        cb();
    });
}


loadUsers(function() {
    loadLists(function() {
        done();
    });
});
```

```javascript
function formatDate(d) {
    return moment(d).format('DD.MM.YYYY, h:mm:ss');
}
```

```html
<html>
  <head>
    <script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/flot/0.8.1/jquery.flot.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/flot/0.8.2/jquery.flot.pie.min.js"></script>
  </head>
  <body>
        <style>
           table, th, td {
             border: 1px solid black;
           }
        </style>
        
        <h1>Users table</h1>
        
        <table>
            <tr><th>User</th><th>Date Created</th></tr>
            {{for #data.users.data.d.results}}
                <tr >
                    <td>{{:Title}}</td>
                    <td>{{:~formatDate(Created)}}</td>
                </tr>    
            {{/for}}
        </table>
    
        <h1>Lists with sizes</h1> 
    
        <div id="placeholder" style="width:700px;height:350px"></div>
    
        <script>
            $(function () {   
                var data = [];
    
                {{for #data.lists.data.d.results}}
                    data.push({
                        label: "{{:Title}}",
                        data: {{:ItemCount}}
                    });
                {{/for}}
    
                $.plot('#placeholder', data, { series: { pie: {  show: true   } } });
            });
        </script>
        
    </body>
</html>
```