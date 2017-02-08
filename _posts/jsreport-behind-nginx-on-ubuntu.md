{{{
    "title"    : "jsreport behind nginx on ubuntu",      
    "date"     : "06-07-2016 16:30"
}}}


Quite common deployment is to run multiple web applications on the same domain and same server. I'm gonna show you now how to run jsreport in such a environment using [nginx](http://nginx.org/) reverse proxy. This tutorial is specific for Ubuntu distribution, but it should be easily adaptable for other distributions.

##Install nginx

```sh
sudo apt-get update
sudo apt-get install nginx
```

This automatically starts nginx web server and you should be able to hit the default page over http

##Install nodejs

```sh
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
```

##Install jsreport

```
npm install jsreport --production
node_modules/.bin/jsreport init
```

Edid`prod.config.json`:
-  change `httpsPort` to `"httpPort": 8080`
- add `"appPath": "/reporting"`

Now start jsreport
```sh
npm start --production
```

You should be able to reach jsreport on `http://localhost:8080` now

##Configure nginx


Replace file `/etc/nginx/sites-available/default` with the one downloaded from [here](https://github.com/jsreport/docs/blob/master/installation/nginx.conf).

After restarting nginx, you should be able to reach jsreport on `http://your-server/reporting`
```sh
sudo service nginx restart
```
