
{{{
    "title"    : "Render reports using azure app service",	   
    "date"     : "01-10-2017 11:42"	
}}}

This tutorial is describing how to quickly set up jsreport server on [
Microsoft Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/app-service-linux-readme) through docker and start creating pdf or excel reports in no time. 

Note that jsreport runs also on VMs, cloud services or container instances without limitations. 

## Create the app service on linux

The first you need to open azure portal and create the app service and Docker OS. As the image select one of the [jsreport/jsreport](https://hub.docker.com/r/jsreport/jsreport/) images. For example `jsreport/jsreport:2.0.1-full`.

![azure linux](https://jsreport.net/blog/azure-docker.png?v=3)

Creating application takes usually several minutes so be patient. You should be able to open web application in the browser afterwards.

![studio](https://jsreport.net/screenshots/studio.png?v=2)

## Configure jsreport 

Later you may need to configure jsreport. The easiest way is to use the environment variables which can be set right in the `Application Settings` in the azure portal.

Lets enable [jsreport authentication](https://jsreport.net/learn/authentication) for example by setting the following variables

```
extensions_authentication_admin_username=admin
extensions_authentication_admin_password=xxx
```

![azure config](https://jsreport.net/blog/azure-config.png?v=4)

Wait couple of seconds to propagate the change into the service, restart the web app and refresh the jsreport studio. You should see the login screen.

This was just one of the many configuration options you may need. Please find more configuration options in the [documentation](https://jsreport.net/learn/configuration).

## Persist template in azure storage

You would soon realize that the stored templates are lost if you restart the app service. This is because the jsreport stores the data by default right in the container. You may rather want to store templates in an external database and obvious choice in azure is the azure blob storage. You can find some background in [template store docs](https://jsreport.net/learn/fs-store#azure-storage).

The first you need to create azure storage account and copy its name and the key. In case you want to run multiple instances of jsreport you need to create also service bus.

Now set up the environment variables and apply the configuration.  Azure doesn't support `-` in the environment variables, but fortunately jsreport accepts also configs without it. 
```
extensions_fsStore_persistence_provider=azure-storage
extensions_fsStore_sync_provider=azure-sb
extensions_fsStoreAzureStoragePersistence_accountName=jsreport
extensions_fsStoreAzureStoragePersistence_accountKey=xxx
extensions_fsStoreAzureSbSync_connectionString=xxx
```

Now restart web app and the service should automatically apply the settings and your templates will be stored inside the azure storage account. Note the azure storage is not the only choice. There are several more drivers you can choose from. See the [template store documentation](https://jsreport.net/learn/template-stores) for details.

