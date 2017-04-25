{{{
    "title": "Single Sign On Support",
    "date": "04-24-2017 22:00"
}}}

With the release of jsreport 1.7 we are introducing our first implementation for single sign on support in jsreport, this means that jsreport is capable to delegate authentication verification to an authorization server (a central server capable to validate user identity).

## Overview

This feature is interesting because it allows jsreport to be expose as a product that uses a central authentication mechanish (authorization server), which means that you can treat jsreport just like a part of a suite of applications that shares the same users and has a central way to authenticate users.

When using this feature the authentication flow in jsreport turns into the following:

- Get a token from the authorization server (the necessary steps and details to get the token will depend on the implementation of your authorization server)

- All protected endpoints in the jsreport HTTP API now expect a token (issued by the authorization server) to be provided in `Authorization` header, the token must be sent using `Bearer` auth schema

- With the received token, jsreport will send the token to the authorization server expecting a validation response

- The authorization server will validate the token and send a validation response to jsreport

- If the token validation is successful jsreport will let you access the requested resource otherwise it will respond with an authorization error

For a more technical and detailed overview of this authentication flow check the [authentication docs](https://jsreport.net/learn/authentication) and the new `authorizationServer` options

## Official sample

We have prepared an [official sample](https://github.com/bjrmatos/jsreport-with-authorization-server-sample) with a real showcase of jsreport + authorization server (powered by [IdentityServer4](https://github.com/IdentityServer/IdentityServer4) using `OpenID Connect` protocol) to implement Single Sign On, hopefully the sample will give you an idea and a reference of how the servers can communicate between each other and all the necessary steps.

As part of our first release with single sign on support we are only allowing this kind of authentication only in the jsreport HTTP API, but we are looking for real feedback about this feature and then decide if it is useful to expand this feature in other places (like authentication in jsreport studio).

We recommend to try it out this feature if you have the need for it and let us know how it goes, feedback and improvements are always welcome!
