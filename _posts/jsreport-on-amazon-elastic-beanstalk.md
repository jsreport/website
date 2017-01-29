{{{
    "title"    : "jsreport on Amazon Elastic Beanstalk",
    "date"     : "09-10-2015 15:20"
}}}

jsreport runs cross platform almost everywhere and [AWS Elastic Beanstalk](https://aws.amazon.com/documentation/elastic-beanstalk/) is not an exception.  It just takes couple of minutes to have it running on the free tier. Here are some notes and  a guidance how to make it running there.

#Quick Start

##Prepare application package

You need to prepare an application package first.  The easiest way to create this package is to install jsreport locally:
```sh
npm install jsreport
node node_modules/jsreport --init
node server.js
```
And then zip the files `prod.config.json`, `server.js` and `package.json` into a single `package.zip`.

## Launch Elastic Beanstalk 

The next step is to launch a new Elastic Beanstalk environment and upload `package.zip` you previously created.  The application should be created as a Web Server with node.js pre configured type. Only exception is the environment variables page where you should add pair **NODE_ENV=production**. This instructs jsreport to use bundled client sources and also `prod.config.json` configuration file. The rest is just about following the wizard and keeping the default values.

Now you should be able to reach the public endpoint and render reports. Simple!


#Adding persistent volume
AWS Elastic Beanstalk unfortunately doesn't provide a persistent file system storage out of the box. This means that you can loose your stored report templates if the hardware fails in the default configuration. To overcome this limitation you can use Amazon EBS and attach an additional persistent disk to the Elastic Beanstalk instance.

##Create EBS volume
The first you need to create an EBS volume in the region as the elastic beanstalk service. Wait after the volume is initialized and copy its id.

##Mount the volume

You can use the following beanstalk config to mount the volume automatically during the deployment. This config should be stored in the `.ebextensions` folder.

<script src="https://gist.github.com/pofider/d6804761f5e2184bf027.js"></script>

1. Replace `vol-ddb08e34` with your volume id
2. Replace `eu-central-1` with volume and Elastic Beanstalk instance region
3. Make sure the Elastic Beanstalk has the same custom region in the scaling configuration as the EBS volume. You can do this only manually after the service is deployed for the first time.
4. Open AWS console and navigate to IAM > Roles > aws-elasticbeanstalk-ec2-role. There you should attach AdministratorAccess policy so the service can attach to the volume

##Configure jsreport

The next step is to configure jsreport to store its data to the mounted volume. This is done in the `prod.config.json` with the following change:

```js
"dataDirectory": "/media/ebs_volume", 
"logger": {
   "logDirectory": "/media/ebs_volume/logs"
}
```

##Deploy

Finally it is time to deploy again the zipped application. Now it should contain files `prod.config.json`,  `server.js`,  `package.json` and `.ebsextensions\01ebs.config`.

Now you should be able to reach the public endpoint!

#Horizontal scaling and Mongo
> **Update **
> You can now use also MS SQL Server or PostgreSQL stores - see available [Templates' stores](https://jsreport.net/learn/extensions) 

You have now running jsreport in Elastic Beanstalk which is storing data on replicated mounted disk provided by Amazon EBS. However this still doesn't let you to horizontally scale multiple server nodes talking to a single storage. Why? Because jsreport default data driver is using [nedb](https://github.com/louischatriot/nedb) which is not a full database and it doesn't support concurrent access. To get fully horizontally scalable reporting server you need to use a full database with supported jsreport data driver. This currently fulfills [mongodb](https://www.mongodb.org/). 

The installation of the mongodb is not in the scope of this article, but we recommend you to check out the [mongolab service](https://mongolab.com/) or [official mongo cloud manager](https://www.mongodb.com/cloud/) to get the db quickly running.

If you have an access to the running mongodb you need to make two changes.

Add the `jsreport-mongodb-store` and `mongodb` module to the `package.json` dependencies:

```
 "dependencies": {
    "mongodb": "*",
    "jsreport": "*",
    "jsreport-mongodb-store": "*",    
} 
```

Update the connection string inside`prod.config.json` :
```js
{ "name": "mongodb", "authDb": "my-db", "address": "foo.mlab.com", "port": 37657, "databaseName" : "my-db", "username": "mydbuser", "password":"password" },
```

Now you can scale up to render even millions reports per hour. Enjoy!


