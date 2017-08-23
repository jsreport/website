{{{
    "title"    : "Render reports using azure app service",	   
    "date"     : "01-10-2017 11:42"	
}}}

This tutorial is describing how to quickly set up jsreport server on [
Microsoft Azure linux app service](https://docs.microsoft.com/en-us/azure/app-service/app-service-linux-readme) and start creating pdf or excel reports in no time. 

Note that jsreport runs also on VMs, cloud services or container instances without limitations. The only jsreport limitation for windows based Azure web apps is that it doesn't support custom fonts in pdf there.

##Create the app service on linux

The first you need to open azure portal and create the linux app service.

![azure linux](https://jsreport.net/blog/azure-linux.png)


The next you have to switch the app service container to docker hub and pick up the image from the [jsreport docker hub repository](https://hub.docker.com/r/jsreport/jsreport). Lets pick `jsreport/jsreport:latest-full` for this tutorial.


![azure linux](https://jsreport.net/blog/azure-docker.png?v=3)

Finally you wait a minute until the service is created and open it in the browser. The jsreport studio pops up and you can start to play with it. 

![studio](https://jsreport.net/screenshots/studio.png?v=2)

##Configure jsreport 

Later you may need to configure jsreport. The easiest way is to use the environment variables which can be set right in the `Application Settings` in the azure portal.

Lets enable [jsreport authentication](https://jsreport.net/learn/authentication) for example by setting the following variables

```
authentication_enabled=true
authentication_admin_username=admin
authentication_admin_password=xxx
```

![azure config](https://jsreport.net/blog/azure-config.png?v=3)

Wait couple of seconds to propagate the change into the service and refresh the jsreport studio. You should see the login screen.

This was just one of the many configuration options you may need. Please find more configuration options in the [documentation](https://jsreport.net/learn/configuration).

##Persist template on sql server

You would soon realize that the stored templates are lost if you restart the app service. This is because the jsreport stores the data by default right in the container. You may rather want to store the templates in the external database and obvious choice in azure is the azure sql server.

Now you should create the sql database and copy paste its connection string.

![azure sql](https://jsreport.net/blog/azure-sql.png?v=2)

Now you need to paste the connection string as environment variable and configure jsreport to use it. Note you should only paste the part of the connection string like on the following example.
```
connectionString_name=mssql
connectionString_uri=Server=tcp:jsreport-test.database.windows.net,1433;Initial Catalog=test;Persist Security Info=False;User ID=jsreport;Password=xxx;MultipleActiveResultSets=False;Encrypt=True;
```

![azure connection](https://jsreport.net/blog/azure-connection.png?v=2)

That is it. The service should now automatically apply the settings and your templates will be stored inside the sql database.

##More about jsreport

Are you new to jsreport and want to know more? Please watch the [introduction video](https://www.youtube.com/watch?v=mf8-SdGjsdo), fiddle with [jsreport playground demos](https://jsreport.net/playground) or visit [jsreport learn seaction](https://jsreport.net).
