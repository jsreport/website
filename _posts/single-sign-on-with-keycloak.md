
{{{
    "title": "Single Sign On With Keycloak",
    "date": "08-01-2022 20:00"
}}}

This post is intended to describe the [single sign on capabilities of jsreport](https://jsreport.net/learn/authentication#single-sign-on-using-an-authorization-server) with the [Keycloak](https://www.keycloak.org/) authorization server, we will focus on the two ways you can use this feature to integrate the **jsreport studio** with Keycloak and delegate the user authentication to it.

## Installing jsreport

Let's start by installing jsreport, create a new directory on your preferred location and run `jsreport init`.
when it is done you should see something like this on your terminal

```
➜ jsreport init
jsreport installation not found, installing jsreport the latest version now, wait a moment...
jsreport installation finished..
Creating server.js
Creating package.json
Creating default config jsreport.config.json
Initialized
```

## Run Keycloak

The easiest way to install and run [Keycloak](https://www.keycloak.org/) is by using [Docker](https://www.keycloak.org/getting-started/getting-started-docker), so let's go that route.

run the following `docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:19.0.1 start-dev`, which will start Keycloak on port `8080` with an initial admin user

```
username: admin
password: admin
```

Now we need to configure the Keycloak, to do this we go to the [Keycloak Admin Console](http://localhost:8080/admin) and login there with the admin username and password we specified in the `docker run ...`.

![keycloak-login](https://jsreport.net/blog/keycloak-login.jpg)

we start by creating a new realm, we open the select on the left side bar and click `Create Realm`, we will use the name `jsreport`.

![keycloak-new-realm](https://jsreport.net/blog/keycloak-new-realm.jpg)

![keycloak-new-realm2](https://jsreport.net/blog/keycloak-new-realm2.jpg)

with the `jsreport` realm created we can now access the OpenID endpoints exposed by Keycloak by opening this page http://localhost:8080/realms/jsreport/.well-known/openid-configuration. we need to copy some of these endpoints in the jsreport configuration in order to configure the integration appropriately.

## Configuring authorization server in jsreport

open the `jsreport.config.json` file and add the following changes:

- set `extensions.authentication.cookieSession.secret` to a secret value
- change the `extensions.authentication.enabled` to `true`
- add `extensions.authentication.authorizationServer` configuration
  - set `extensions.authentication.authorizationServer.name` to `KeycloakServer`
  - set `extensions.authentication.authorizationServer.issuer` to the value of the `issuer` key listed in the [Keycloak OpenID configuration](http://localhost:8080/realms/jsreport/.well-known/openid-configuration)
  - set `extensions.authentication.authorizationServer.usernameField` to `preferred_username`
  - set `extensions.authentication.authorizationServer.endpoints.jwks` to the value of the `jwks_uri` key listed in the [Keycloak OpenID configuration](http://localhost:8080/realms/jsreport/.well-known/openid-configuration)
  - set `extensions.authentication.authorizationServer.endpoints.authorization` to the value of the `authorization_endpoint` key listed in the [Keycloak OpenID configuration](http://localhost:8080/realms/jsreport/.well-known/openid-configuration)
  - set `extensions.authentication.authorizationServer.endpoints.token` to the value of the `token_endpoint` key listed in the [Keycloak OpenID configuration](http://localhost:8080/realms/jsreport/.well-known/openid-configuration)
  - set `extensions.authentication.authorizationServer.endpoints.introspection` to the value of the `introspection_endpoint` key listed in the [Keycloak OpenID configuration](http://localhost:8080/realms/jsreport/.well-known/openid-configuration)
  - set `extensions.authentication.authorizationServer.endpoints.userinfo` to the value of the `userinfo_endpoint` key listed in the [Keycloak OpenID configuration](http://localhost:8080/realms/jsreport/.well-known/openid-configuration)

your `jsreport.config.json` at this after these changes should look like this:

```js
{
  "httpPort": 5488,
  "store": {
    "provider": "fs"
  },
  "blobStorage": {
    "provider": "fs"
  },
  "logger": {
    "console": {
      "transport": "console",
      "level": "debug"
    },
    "file": {
      "transport": "file",
      "level": "info",
      "filename": "logs/reporter.log"
    },
    "error": {
      "transport": "file",
      "level": "error",
      "filename": "logs/error.log"
    }
  },
  "trustUserCode": false,
  "reportTimeout": 60000,
  "workers": {
    "numberOfWorkers": 2
  },
  "extensions": {
    "authentication": {
      "cookieSession": {
        "secret": "secret"
      },
      "admin": {
        "username": "admin",
        "password": "password"
      },
      "authorizationServer": {
        "name": "KeycloakServer",
        "issuer": "http://localhost:8080/realms/jsreport",
        "usernameField": "preferred_username",
        "endpoints": {
          "jwks": "http://localhost:8080/realms/jsreport/protocol/openid-connect/certs",
          "authorization": "http://localhost:8080/realms/jsreport/protocol/openid-connect/auth",
          "token": "http://localhost:8080/realms/jsreport/protocol/openid-connect/token",
          "introspection": "http://localhost:8080/realms/jsreport/protocol/openid-connect/token/introspect",
          "userinfo": "http://localhost:8080/realms/jsreport/protocol/openid-connect/userinfo"
        }
      },
      "enabled": true
    },
    "sample-template": {
      "createSamples": true
    }
  }
}
```

## Creating client applications for jsreport in Keycloak

we now need to register the jsreport studio and jsreport http api applications in keycloak so that they can request authentication of a user against keycloak.

to do this we click to the `Clients` of the left side bar and then click `Create client`.

![keycloak-new-client](https://jsreport.net/blog/keycloak-new-client.jpg)

register the following information and click `Save` for the `jsreport-studio`

![keycloak-jsreport-studio](https://jsreport.net/blog/keycloak-jsreport-studio.jpg)

![keycloak-jsreport-studio2](https://jsreport.net/blog/keycloak-jsreport-studio2.jpg)

and the following information for the `jsreport-api`

![keycloak-jsreport-api](https://jsreport.net/blog/keycloak-jsreport-api.jpg)

![keycloak-jsreport-api2](https://jsreport.net/blog/keycloak-jsreport-api2.jpg)

back to the `Clients` list page we click on the `jsreport-studio`, add `*` to the `Valid redirect URIs` field and click `Save`

![keycloak-clients-jsreport-studio](https://jsreport.net/blog/keycloak-clients-jsreport-studio.jpg)

![keycloak-clients-jsreport-studio-settings](https://jsreport.net/blog/keycloak-clients-jsreport-studio-settings.jpg)

now we need to copy the credentials generated for this client application and add them to the `jsreport.config.json`, we click the `Credentials` tab and click on the `Copy to clipboard` for the `Client secret`

![keycloak-clients-jsreport-studio-credentials](https://jsreport.net/blog/keycloak-clients-jsreport-studio-credentials.jpg)

with the secret copied we open the `jsreport.config.json` and add the following at `extensions.authentication.authorizationServer.studioClient`

```js
"authorizationServer": {
  ...
  "studioClient": {
    "clientId": "jsreport-studio",
    "clientSecret": "<the secret your copied from keycloak>"
  }
  ...
}
```

we repeat the same steps for the `jsreport-api` client, we add `*` to the `Valid redirect URIs` field, copy the secret and add it to the `extensions.authentication.authorizationServer.apiResource`

![keycloak-clients-jsreport-api](https://jsreport.net/blog/keycloak-clients-jsreport-api.jpg)

![keycloak-clients-jsreport-api-settings](https://jsreport.net/blog/keycloak-clients-jsreport-api-settings.jpg)

![keycloak-clients-jsreport-api-credentials](https://jsreport.net/blog/keycloak-clients-jsreport-api-credentials.jpg)

```js
"authorizationServer": {
  ...
  "apiResource": {
    "clientId": "jsreport-api",
    "clientSecret": "<the secret your copied from keycloak>"
  }
  ...
}
```

the final `jsreport.config.json` should look something like this (remember that you should replace the parts `<the secret your copied from keycloak>` with the values you copy from Keycloak)

```js
{
  "httpPort": 5488,
  "store": {
    "provider": "fs"
  },
  "blobStorage": {
    "provider": "fs"
  },
  "logger": {
    "console": {
      "transport": "console",
      "level": "debug"
    },
    "file": {
      "transport": "file",
      "level": "info",
      "filename": "logs/reporter.log"
    },
    "error": {
      "transport": "file",
      "level": "error",
      "filename": "logs/error.log"
    }
  },
  "trustUserCode": false,
  "reportTimeout": 60000,
  "workers": {
    "numberOfWorkers": 2
  },
  "extensions": {
    "authentication": {
      "cookieSession": {
        "secret": "secret"
      },
      "admin": {
        "username": "admin",
        "password": "password"
      },
      "authorizationServer": {
        "name": "KeycloakServer",
        "issuer": "http://localhost:8080/realms/jsreport",
        "usernameField": "preferred_username",
        "endpoints": {
          "jwks": "http://localhost:8080/realms/jsreport/protocol/openid-connect/certs",
          "authorization": "http://localhost:8080/realms/jsreport/protocol/openid-connect/auth",
          "token": "http://localhost:8080/realms/jsreport/protocol/openid-connect/token",
          "introspection": "http://localhost:8080/realms/jsreport/protocol/openid-connect/token/introspect",
          "userinfo": "http://localhost:8080/realms/jsreport/protocol/openid-connect/userinfo"
        },
        "studioClient": {
          "clientId": "jsreport-studio",
          "clientSecret": "<the secret your copied from keycloak>"
        },
        "apiResource": {
          "clientId": "jsreport-api",
          "clientSecret": "<the secret your copied from keycloak>"
        }
      },
      "enabled": true
    },
    "sample-template": {
      "createSamples": true
    }
  }
}
```

## Configuring keycloak users for login to jsreport studio

jsreport needs to know how to associate the users from Keycloak to users/groups in jsreport, this association is needed to correctly identify which jsreport entities and permissions the user of Keycloak is able to work with in the context of jsreport.

There are two ways we can use the keycloak users for the login in jsreport studio.

1. **associate a keycloak user to an existing jsreport user**. this method requires that you create jsreport user, keycloak user and match them, mostly by a claim that points to the username. in this method you need to duplicate your keycloack users in jsreport, for both to work together. this method only exists for legacy reasons because before the jsreport `3.2.0` version the only way to attach permissions was to use jsreport users and it was needed an strict map.
2. **associate a keycloak user to a jsreport group**. this method allows you to avoid duplicating keycloak users in jsreport. on the jsreport side you will need to handle all the permissions in jsreport using `groups`, by attaching permissions directly to the `read permission group`, `edit permissions group` fields of entities, and on the Keycloak side you will need to set an extra attribute on each user in order to associate it to the jsreport group it belongs.

### Option 1: Associate a keycloak user to an existing jsreport user

On the [Keycloak Admin Console](http://localhost:8080/admin) let's go to the `Users` section of the left side bar and click `Create new user`.

![keycloak-users](https://jsreport.net/blog/keycloak-users.jpg)

there we fill the following information and click `Create`:

![keycloak-new-user](https://jsreport.net/blog/keycloak-new-user.jpg)

we click on the `Credentials` tab, click `Set password` and create a password for this user and click `Save`.

![keycloak-user-credentials](https://jsreport.net/blog/keycloak-user-credentials.jpg)

![keycloak-user-credentials-password](https://jsreport.net/blog/keycloak-user-credentials-password.jpg)

now we start jsreport by running `npm start`, we go to `http://localhost:5488` and we see the login page

![keycloak-jsreport-studio-login](https://jsreport.net/blog/keycloak-jsreport-studio-login.jpg)

we notice that there is new button `LOGIN WITH KEYCLOAKSERVER`, but for now we are not going to use it, we need to create a jsreport user first before we can login in studio with Keycloak.

on the studio login page we login with our jsreport admin user credentials (which by default are `username: admin, password: password`) and proceed to create a new jsreport user.

![keycloak-jsreport-studio-new-user](https://jsreport.net/blog/keycloak-jsreport-studio-new-user.jpg)

the new user should match the user created on Keycloak, so we are going to name it the same `ukeycloak` (it is not needed the we use the same password)

![keycloak-jsreport-studio-new-user-details](https://jsreport.net/blog/keycloak-jsreport-studio-new-user-details.jpg)

we are going to edit the permissions for the `sample` folder in the jsreport studio, in order for the `ukeycloak` user to see entities there when its login passes.

![keycloak-folder-user-permissions](https://jsreport.net/blog/keycloak-folder-user-permissions.jpg)

![keycloak-folder-user-permission2](https://jsreport.net/blog/keycloak-folder-user-permission2.jpg)

![keycloak-folder-user-permission3](https://jsreport.net/blog/keycloak-folder-user-permission3.jpg)

now we are ready to test login in jsreport studio with Keycloak, we first logout our current session.

![keycloak-jsreport-studio-logout](https://jsreport.net/blog/keycloak-jsreport-studio-logout.jpg)

we should see now the jsreport studio login page, now we click the `LOGIN WITH KEYCLOAKSERVER` button, after it we are now redirected to the Keycloak login page, there we enter the password for the `ukeycloak` user.

![keycloak-jsreport-studio-login](https://jsreport.net/blog/keycloak-jsreport-studio-login.jpg)

![keycloak-jsreport-studio-user-sso](https://jsreport.net/blog/keycloak-jsreport-studio-user-sso.jpg)

finally we should now be logged in studio, and we should be able to see the `samples` folder.

![keycloak-jsreport-studio-user-sso-success](https://jsreport.net/blog/keycloak-jsreport-studio-user-sso-success.jpg)

### Option 2: Associate a keycloak user to a jsreport group

On the [Keycloak Admin Console](http://localhost:8080/admin) let's go to the `Users` section of the left side bar and click `Add user`.

![keycloak-users2](https://jsreport.net/blog/keycloak-users2.jpg)

there we fill the following information and click `Create`:

![keycloak-new-user2](https://jsreport.net/blog/keycloak-new-user2.jpg)

we click on the `Credentials` tab, click `Set password` and create a password for this user and click `Save`.

![keycloak-user-credentials2](https://jsreport.net/blog/keycloak-user-credentials2.jpg)

![keycloak-user-credentials-password2](https://jsreport.net/blog/keycloak-user-credentials-password2.jpg)

we click on the `Attributes` tab, and add a `group` key with the value `gkeycloak` and click `Save`

![keycloak-user-attributes](https://jsreport.net/blog/keycloak-user-attributes.jpg)

go to the `Client scopes` on the left side bar and search for the `profile` item, and click it.

![keycloak-client-scopes](https://jsreport.net/blog/keycloak-client-scopes.jpg)

click `Mappers` tab and click the `Add mapper`, `By configuration` button

![keycloak-profile-scope-new-mapper](https://jsreport.net/blog/keycloak-profile-scope-new-mapper.jpg)

choose `User Attribute from the list` and fill the following details and click `Save`:

![keycloak-profile-scope-new-mapper-options](https://jsreport.net/blog/keycloak-profile-scope-new-mapper-options.jpg)

![keycloak-profile-scope-new-mapper-details](https://jsreport.net/blog/keycloak-profile-scope-new-mapper-details.jpg)

we go to jsreport studio at `http://localhost:5488`, if there is active session we should logout first. we need to create a jsreport group first before we can test the login with Keycloak for the group.

on the studio login page we login with our jsreport admin user credentials (which by default are `username: admin, password: password`) and proceed to create a new jsreport group.

![keycloak-jsreport-studio-new-group](https://jsreport.net/blog/keycloak-jsreport-studio-new-group.jpg)

the new group should match the group value we used in the attributes of `ukeycloak2` user on Keycloak, so we are going to name it `gkeycloak`

![keycloak-jsreport-studio-new-group-details](https://jsreport.net/blog/keycloak-jsreport-studio-new-group-details.jpg)

we are going to edit the group permissions for the `sample` folder in the jsreport studio, in order for the `ukeycloak2` user to see entities there when its login passes.

![keycloak-folder-group-permissions](https://jsreport.net/blog/keycloak-folder-group-permissions.jpg)

![keycloak-folder-group-permissions2](https://jsreport.net/blog/keycloak-folder-group-permissions2.jpg)

![keycloak-folder-group-permissions3](https://jsreport.net/blog/keycloak-folder-group-permissions3.jpg)

now again, we are ready to test login in jsreport studio with Keycloak, we first logout our current session.

![keycloak-jsreport-studio-logout](https://jsreport.net/blog/keycloak-jsreport-studio-logout.jpg)

on the jsreport studio login page, we click the `LOGIN WITH KEYCLOAKSERVER` button, after it we are now redirected to the Keycloak login page, there we enter the password for the `ukeycloak2` user.

![keycloak-jsreport-studio-login](https://jsreport.net/blog/keycloak-jsreport-studio-login.jpg)

![keycloak-jsreport-studio-group-sso](https://jsreport.net/blog/keycloak-jsreport-studio-group-sso.jpg)

finally we should now be logged in studio, and we should be able to see the `samples` folder.

![keycloak-jsreport-studio-group-sso-success](https://jsreport.net/blog/keycloak-jsreport-studio-group-sso-success.jpg)

## Conclusion

Hope this post helps to understand better the two ways to integrate single sign on with jsreport, the source code for this post can be found [here](https://github.com/bjrmatos/jsreport-with-keycloak-authorization-server-sample)
