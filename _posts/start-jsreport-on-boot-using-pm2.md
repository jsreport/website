{{{
    "title"    : "Start jsreport on boot using pm2",      
    "date"     : "06-07-2016 16:32"
}}}

Normally you want to start jsreport automatically every time the server reboots. You can manually create upstart scripts for it, or better, use great [pm2](https://github.com/Unitech/pm2)  package to do the job for you. Additionally to auto start capabilities pm2 gives you united access to logs or monitoring  to every other node application you may run.

Setting it up is just about a minute:

```sh
# install pm2
sudo npm install pm2 -g

# start pm2 daemon running jsreport
sudo pm2 start npm -- start --production

# create startup script for running jsreport after boot
sudo pm2 startup
sudo pm2 save
```



