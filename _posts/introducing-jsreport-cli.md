{{{
    "title": "Introducing jsreport-cli",
    "date": "03-09-2017 20:25"
}}}

Let's welcome `jsreport-cli`, a new extension and utility that we know you will find very useful which is available from jsreport 1.5, `jsreport-cli` is a CLI for jsreport, which have very useful commands that will speed up the way how you interact with jsreport.

## A new way to get started

Our previous steps to get started with jsreport were:

```
npm install jsreport
node node_modules/jsreport --init
npm start
```

Now, with the CLI these are the new steps:

```
npm install -g jsreport-cli
jsreport init
jsreport start
```

The previous steps are still working, but we recommend the usage of the CLI from now on for the best experience.

Note that you only need to `npm install -g jsreport-cli` one time per machine, after that you will have the global `jsreport` command in your machine which you can use in any directory, everywhere.

## Generate jsreport configuration

After installing jsreport you probably need to tweak the configuration of jsreport to meet your needs, but doing this task manually can be a little tedious at first, fortunately the CLI has a command `configure` to help you on this task, you will be asked some questions and based on the responses a configuration file will be created.

<br/>
![configure executable](configure-executable.gif)

## Installing jsreport as windows service

For windows users we have always had a way to install their jsreport apps as windows services, this functionality is part of the CLI too through the usage of `win-install` and `win-uninstall` commands.

The previous way to install/uninstall windows services was using `node node_modules/jsreport --install` and `node node_modules/jsreport --uninstall`, this way is still working, so you don't need to worry about breaking something.

## Rendering reports directly from the CLI

the CLI has a very handy command, `render`, which you can use to render some reports directly from your console, this command has the ability to render local templates, local templates using a background process (for the best performance), and even remote templates (connecting to a remote jsreport server).

<br/>

![render command](render-command.gif)

We are very excited for the release of this new extension and for what comes next, you can find all relevant documentation for the CLI [here](https://jsreport.net/learn/cli).

As always let us know what you think about this new feature or if you have some feedback about it.
