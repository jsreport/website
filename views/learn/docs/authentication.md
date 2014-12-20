> Add login screen to jsreport editor and authenticate API requests

##Basics

Enabling `authentication` extension will add a login screen into jsreport studio and authenticate all incoming requests. The browser authentication is based on the cookie and API calls are verified using [basic](http://en.wikipedia.org/wiki/Basic_access_authentication) authentication.

Extension currently supports only a single admin user.

##Configuration
jsreport provides simple access `Authentication` through [configuration file](https://github.com/jsreport/jsreport/blob/master/config.md).

To enable authentication add following json into `[prod|dev].config.json`

```js
"authentication" : {
	"cookieSession": {
        "secret": "dasd321as56d1sd5s61vdv32",
        "cookie": {
            "domain": "localhost"
        }
	},
	"admin": {
		"username" : "admin",
		"password": "password"
	}
},
```

You can change admin username or password and you will also need to change `cookieSession.cookie.domain` to your domain host or ip address.

##API
You need to add header to every request when is this extension enabled.

`Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==`

Where the hash is based on username and password:
`base64(username:password)`

